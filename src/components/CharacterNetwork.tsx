import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { useTranslation } from "react-i18next";

interface Character {
  id: string;
  nameEn: string;
  nameZh: string;
  roleEn: string;
  image: string;
}

interface NetworkProps {
  characters: Character[];
  onNodeClick: (char: Character) => void;
}

const LINK_COLORS: Record<string, string> = {
  "Mentors": "#d97706", // Amber 600
  "Interacts": "#2563eb", // Blue 600
  "Skylands Builders": "#16a34a", // Green 600
};

const LINK_DESCRIPTIONS: Record<string, { en: string, zh: string }> = {
  "Mentors": {
    en: "Guidance and teaching relationship between characters.",
    zh: "角色之間的指導與教學關係。"
  },
  "Interacts": {
    en: "General story interactions and encounters.",
    zh: "一般的劇情互動與遭遇。"
  },
  "Skylands Builders": {
    en: "Characters working together on major construction projects.",
    zh: "共同參與大型建設工程的角色。"
  }
};

export default function CharacterNetwork({ characters, onNodeClick }: NetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(
    new Set(Object.keys(LINK_COLORS))
  );
  const [isAutoExpand, setIsAutoExpand] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLabels, setShowLabels] = useState<boolean>(true);

  const visibleCount = useMemo(() => {
    if (searchQuery.trim() === "") return characters.length;
    
    const q = searchQuery.toLowerCase();
    const matchedNode = characters.find(n => 
      (n.nameEn && n.nameEn.toLowerCase().includes(q)) || 
      (n.nameZh && n.nameZh.toLowerCase().includes(q))
    );
    
    if (!matchedNode) return characters.length;

    const protagonistId = "132";
    let rawLinks: { source: string; target: string; type: string }[] = [];
    
    characters.forEach(node => {
      if (node.id === "465") { 
        rawLinks.push({ source: node.id, target: protagonistId, type: "Mentors" });
      } else if (node.id !== protagonistId) {
        rawLinks.push({ source: protagonistId, target: node.id, type: "Interacts" });
      }
    });

    const hasTinkaton = characters.some(n => n.id === "959");
    const hasGreedent = characters.some(n => n.id === "820");
    if (hasTinkaton && hasGreedent) {
      rawLinks.push({ source: "820", target: "959", type: "Skylands Builders" });
    }

    const filteredLinks = rawLinks.filter(l => visibleTypes.has(l.type));
    
    const connectedIds = new Set<string>();
    connectedIds.add(matchedNode.id);
    
    filteredLinks.forEach(l => {
      // In rawLinks, source and target are strings
      if (l.source === matchedNode.id) connectedIds.add(l.target);
      if (l.target === matchedNode.id) connectedIds.add(l.source);
    });

    return connectedIds.size;
  }, [characters, searchQuery, visibleTypes]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || characters.length === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const nodes = characters.map(d => ({ ...d }));
    const protagonistId = "132"; // Ditto
    
    let links: { source: string; target: string; type: string }[] = [];
    
    nodes.forEach(node => {
      if (node.id === "465") { 
        links.push({ source: node.id, target: protagonistId, type: "Mentors" });
      } else if (node.id !== protagonistId) {
        links.push({ source: protagonistId, target: node.id, type: "Interacts" });
      }
    });

    const hasTinkaton = nodes.some(n => n.id === "959");
    const hasGreedent = nodes.some(n => n.id === "820");
    if (hasTinkaton && hasGreedent) {
      links.push({ source: "820", target: "959", type: "Skylands Builders" });
    }

    links = links.filter(l => visibleTypes.has(l.type));

    // Create clustering centers based on roleEn
    const roles = Array.from(new Set(characters.map(c => c.roleEn)));
    const roleCenters = new Map<string, { x: number; y: number }>();
    const clusterRadius = Math.min(width, height) / 3.5;
    roles.forEach((role, i) => {
      const angle = (i / roles.length) * 2 * Math.PI - Math.PI / 2;
      roleCenters.set(role, {
        x: width / 2 + Math.cos(angle) * clusterRadius,
        y: height / 2 + Math.sin(angle) * clusterRadius
      });
    });

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("x", d3.forceX().x((d: any) => roleCenters.get(d.roleEn)?.x || width / 2).strength(0.15))
      .force("y", d3.forceY().y((d: any) => roleCenters.get(d.roleEn)?.y || height / 2).strength(0.15))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    if (isAutoExpand) {
      simulation.alphaTarget(0.1);
    }

    // Define arrowhead markers for each color
    Object.entries(LINK_COLORS).forEach(([type, color]) => {
      svg.append("defs").append("marker")
        .attr("id", `arrowhead-${type.replace(/\s+/g, '-')}`)
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 40)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", color)
        .style("stroke", "none");
    });

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => LINK_COLORS[d.type] || "var(--color-line-soft)")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.7)
      .attr("marker-end", (d: any) => `url(#arrowhead-${d.type.replace(/\s+/g, '-')})`)
      .attr("class", "network-link")
      .attr("data-source", (d: any) => d.source.id || d.source)
      .attr("data-target", (d: any) => d.target.id || d.target);

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes as any)
      .join("g")
      .attr("cursor", "pointer")
      .attr("class", "network-node")
      .attr("data-id", (d: any) => d.id)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (e, d: any) => onNodeClick(d))
      .on("mouseenter", (e, d: any) => {
        // Skip hover effect if searching
        if (searchQuery.trim() !== "") return;
        
        // Hover effect highlighting connections
        const connectedIds = new Set();
        connectedIds.add(d.id);
        
        links.forEach(l => {
          const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
          if (s === d.id) connectedIds.add(t);
          if (t === d.id) connectedIds.add(s);
        });

        d3.selectAll(".network-node").transition().duration(200)
          .style("opacity", (n: any) => connectedIds.has(n.id) ? 1 : 0.2);
          
        d3.selectAll(".network-link").transition().duration(200)
          .style("opacity", (l: any) => {
            const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return s === d.id || t === d.id ? 1 : 0.1;
          });
      })
      .on("mouseleave", () => {
        if (searchQuery.trim() !== "") return; // Skip if searching

        d3.selectAll(".network-node").transition().duration(200)
          .style("opacity", 1);
        d3.selectAll(".network-link").transition().duration(200)
          .style("opacity", 0.7);
      });

    // Apply search filter outside of hover event
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchedNode = nodes.find((n: any) => 
        (n.nameEn && n.nameEn.toLowerCase().includes(q)) || 
        (n.nameZh && n.nameZh.toLowerCase().includes(q))
      );

      if (matchedNode) {
        const connectedIds = new Set();
        connectedIds.add(matchedNode.id);
        
        links.forEach(l => {
          const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
          if (s === matchedNode.id) connectedIds.add(t);
          if (t === matchedNode.id) connectedIds.add(s);
        });

        d3.selectAll(".network-node").transition().duration(200)
          .style("opacity", (n: any) => connectedIds.has(n.id) ? 1 : 0.2);
          
        d3.selectAll(".network-link").transition().duration(200)
          .style("opacity", (l: any) => {
            const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return s === matchedNode.id || t === matchedNode.id ? 1 : 0.1;
          });
      } else {
        d3.selectAll(".network-node").style("opacity", 1);
        d3.selectAll(".network-link").style("opacity", 0.7);
      }
    } else {
      d3.selectAll(".network-node").style("opacity", 1);
      d3.selectAll(".network-link").style("opacity", 0.7);
    }

    nodeGroup.append("circle")
      .attr("r", 32)
      .attr("fill", "var(--color-surface-container-high)")
      .attr("stroke", (d: any) => d.roleEn === "Protagonist" ? "var(--color-primary)" : "var(--color-line-soft)")
      .attr("stroke-width", 3)
      .attr("class", "transition-colors");

    nodeGroup.append("image")
      .attr("href", (d: any) => d.image)
      .attr("x", -24)
      .attr("y", -24)
      .attr("height", 48)
      .attr("width", 48)
      .attr("clip-path", "circle(24px at center)");

    nodeGroup.append("text")
      .text((d: any) => i18n.language === "en" ? d.nameEn : d.nameZh)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("font-size", "12px")
      .attr("fill", "var(--color-ink-soft)")
      .style("visibility", showLabels ? "visible" : "hidden");

    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d: any) => i18n.language === "en" ? d.type : (d.type === "Mentors" ? "導師關係" : d.type === "Interacts" ? "劇情互動" : "聯手建設"))
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("fill", (d: any) => LINK_COLORS[d.type] || "var(--color-ink-faint)")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .attr("class", "network-link");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active && !isAutoExpand) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [characters, i18n.language, visibleTypes, isAutoExpand, resetKey, searchQuery, showLabels, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full bg-surface border border-line-soft rounded-sm p-4 mt-8 paper-texture ambient-shadow relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 relative z-10">
        <div>
          <h3 className="font-label-caps text-label-caps text-ink-mute mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">hub</span>
            {i18n.language === "en" ? "Story Character Relationships" : "劇情角色關係圖"}
          </h3>
          <p className="font-mono-metadata text-mono-metadata text-ink-faint">
            {i18n.language === "en" 
                ? "Hover over characters to highlight paths. Drag characters to interact." 
                : "將游標懸停在角色上以凸顯路徑，拖曳角色以互動。"}
          </p>
        </div>

        {/* Toggles and Search */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className="bg-surface-variant border border-line-soft px-3 py-1.5 rounded-sm flex items-center gap-2 mr-2">
            <span className="material-symbols-outlined text-[14px] text-primary">group</span>
            <span className="font-mono-metadata text-xs text-ink-main">
              <strong>{visibleCount}</strong> <span className="text-ink-mute">/ {characters.length}</span>
            </span>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-ink-faint pointer-events-none">search</span>
            <input
              type="text"
              placeholder={i18n.language === "en" ? "Search..." : "搜尋角色..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full border border-line-soft bg-surface-variant font-mono-metadata text-xs text-ink-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-32 md:w-40 transition-all placeholder:text-ink-faint"
            />
          </div>

          <div className="w-px h-6 bg-line-soft mx-1 hidden sm:block"></div>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border ${
              showLabels
                ? "bg-primary text-paper-warm border-primary" 
                : "bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {showLabels ? "visibility" : "visibility_off"}
            </span>
            {i18n.language === "en" ? "Labels" : "標籤"}
          </button>

          <button
            onClick={() => setResetKey(prev => prev + 1)}
            className="font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
          >
            <span className="material-symbols-outlined text-[14px]">my_location</span>
            {i18n.language === "en" ? "Reset View" : "重設視圖"}
          </button>
          
          <button
            onClick={() => setIsAutoExpand(!isAutoExpand)}
            className={`font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border ${
              isAutoExpand 
                ? "bg-primary text-paper-warm border-primary" 
                : "bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isAutoExpand ? 'autorenew' : 'stop_circle'}
            </span>
            {i18n.language === "en" ? "Auto-Expand" : "自動展開"}
          </button>
          
        </div>
      </div>

      <svg ref={svgRef} className="w-full h-[400px]" style={{ touchAction: "none" }}></svg>

      {/* Permanent, Interactive Legend */}
      <div className="mt-4 pt-4 border-t border-line-soft">
        <h4 className="font-label-caps text-label-caps text-ink-mute mb-3">
          {i18n.language === "en" ? "Connection Types (Click to toggle)" : "連線類型 (點選切換顯示)"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(LINK_COLORS).map(([type, color]) => {
            const isActive = visibleTypes.has(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setVisibleTypes(prev => {
                    const next = new Set(prev);
                    if (next.has(type)) {
                       next.delete(type);
                    } else {
                       next.add(type);
                    }
                    return next;
                  });
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-sm border transition-all text-left ${
                  isActive 
                    ? "bg-surface border-line shadow-sm opacity-100" 
                    : "bg-surface-variant border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-[3px] rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="font-mono-metadata text-[10px] text-ink-main uppercase tracking-wider font-semibold">
                    {i18n.language === "en" ? type : (type === "Mentors" ? "導師關係" : type === "Interacts" ? "劇情互動" : "聯手建設")}
                  </span>
                </div>
                <p className="font-mono-metadata text-[10px] text-ink-soft">
                  {i18n.language === "en" ? LINK_DESCRIPTIONS[type]?.en : LINK_DESCRIPTIONS[type]?.zh}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
