import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useTranslation } from "react-i18next";

type CharacterNode = {
  id: string;
  nameEn: string;
  nameZh: string;
  roleEn: string;
  image: string;
};

type Relationship = {
  sourceId: string;
  targetId: string;
  type: string;
};

type RelationshipType = {
  id: string;
  labelEn: string;
  labelZh: string;
  descriptionEn: string;
  descriptionZh: string;
  color: string;
};

type NetworkProps = {
  characters: CharacterNode[];
  relationships: Relationship[];
  relationshipTypes: RelationshipType[];
  onNodeClick: (char: CharacterNode) => void;
};

export default function CharacterNetwork({
  characters,
  relationships,
  relationshipTypes,
  onNodeClick,
}: NetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(
    new Set(relationshipTypes.map((item) => item.id)),
  );
  const [isAutoExpand, setIsAutoExpand] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    setVisibleTypes(new Set(relationshipTypes.map((item) => item.id)));
  }, [relationshipTypes]);

  const visibleLinks = useMemo(
    () => relationships.filter((link) => visibleTypes.has(link.type)),
    [relationships, visibleTypes],
  );

  const visibleCount = useMemo(() => {
    if (searchQuery.trim() === "") return characters.length;

    const query = searchQuery.toLowerCase();
    const matchedNode = characters.find(
      (node) =>
        node.nameEn.toLowerCase().includes(query) || node.nameZh.includes(searchQuery.trim()),
    );

    if (!matchedNode) return characters.length;

    const connectedIds = new Set<string>([matchedNode.id]);
    visibleLinks.forEach((link) => {
      if (link.sourceId === matchedNode.id) connectedIds.add(link.targetId);
      if (link.targetId === matchedNode.id) connectedIds.add(link.sourceId);
    });
    return connectedIds.size;
  }, [characters, searchQuery, visibleLinks]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || characters.length === 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 420;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const typeMap = new Map(relationshipTypes.map((item) => [item.id, item]));
    const nodes = characters.map((character) => ({ ...character }));
    const links = visibleLinks.map((link) => ({ ...link }));

    const roles = Array.from(new Set(characters.map((char) => char.roleEn)));
    const roleCenters = new Map<string, { x: number; y: number }>();
    const clusterRadius = Math.min(width, height) / 3.2;
    roles.forEach((role, index) => {
      const angle = (index / Math.max(roles.length, 1)) * Math.PI * 2 - Math.PI / 2;
      roleCenters.set(role, {
        x: width / 2 + Math.cos(angle) * clusterRadius,
        y: height / 2 + Math.sin(angle) * clusterRadius,
      });
    });

    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links as any).id((datum: any) => datum.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-850))
      .force("x", d3.forceX().x((datum: any) => roleCenters.get(datum.roleEn)?.x || width / 2).strength(0.16))
      .force("y", d3.forceY().y((datum: any) => roleCenters.get(datum.roleEn)?.y || height / 2).strength(0.16))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(56));

    if (isAutoExpand) {
      simulation.alphaTarget(0.1);
    }

    relationshipTypes.forEach((type) => {
      svg
        .append("defs")
        .append("marker")
        .attr("id", `arrowhead-${type.id}`)
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 38)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10,0 L 0,5")
        .attr("fill", type.color)
        .style("stroke", "none");
    });

    const linkSelection = svg
      .append("g")
      .selectAll<SVGLineElement, Relationship>("line")
      .data(links)
      .join("line")
      .attr("stroke", (datum: Relationship) => typeMap.get(datum.type)?.color || "var(--color-line-soft)")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.7)
      .attr("marker-end", (datum: Relationship) => `url(#arrowhead-${datum.type})`)
      .attr("class", "network-link");

    const nodeSelection = svg
      .append("g")
      .selectAll("g")
      .data(nodes as any)
      .join("g")
      .attr("cursor", "pointer")
      .attr("class", "network-node")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded),
      )
      .on("click", (_, datum: CharacterNode) => onNodeClick(datum))
      .on("mouseenter", (_, datum: CharacterNode) => {
        if (searchQuery.trim() !== "") return;

        const connectedIds = new Set<string>([datum.id]);
        links.forEach((link) => {
          if (link.sourceId === datum.id) connectedIds.add(link.targetId);
          if (link.targetId === datum.id) connectedIds.add(link.sourceId);
        });

        d3.selectAll(".network-node")
          .transition()
          .duration(180)
          .style("opacity", (node: any) => (connectedIds.has(node.id) ? 1 : 0.22));

        d3.selectAll(".network-link")
          .transition()
          .duration(180)
          .style("opacity", (link: any) =>
            link.sourceId === datum.id || link.targetId === datum.id ? 1 : 0.12,
          );
      })
      .on("mouseleave", () => {
        if (searchQuery.trim() !== "") return;
        d3.selectAll(".network-node").transition().duration(180).style("opacity", 1);
        d3.selectAll(".network-link").transition().duration(180).style("opacity", 0.7);
      });

    nodeSelection
      .append("circle")
      .attr("r", 32)
      .attr("fill", "var(--color-surface-container-high)")
      .attr("stroke", (datum: CharacterNode) =>
        datum.roleEn === "Protagonist" ? "var(--color-primary)" : "var(--color-line-soft)",
      )
      .attr("stroke-width", 3);

    nodeSelection
      .append("image")
      .attr("href", (datum: CharacterNode) => datum.image)
      .attr("x", -24)
      .attr("y", -24)
      .attr("height", 48)
      .attr("width", 48)
      .attr("clip-path", "circle(24px at center)");

    nodeSelection
      .append("text")
      .text((datum: CharacterNode) => (i18n.language === "en" ? datum.nameEn : datum.nameZh))
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("font-size", "12px")
      .attr("fill", "var(--color-ink-soft)")
      .style("visibility", showLabels ? "visible" : "hidden");

    const linkLabels = svg
      .append("g")
      .selectAll<SVGTextElement, Relationship>("text")
      .data(links)
      .join("text")
      .text((datum: Relationship) => {
        const type = typeMap.get(datum.type);
        return i18n.language === "en" ? type?.labelEn || datum.type : type?.labelZh || datum.type;
      })
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("fill", (datum: Relationship) => typeMap.get(datum.type)?.color || "var(--color-ink-faint)")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .attr("class", "network-link");

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchedNode = nodes.find(
        (node) => node.nameEn.toLowerCase().includes(query) || node.nameZh.includes(searchQuery.trim()),
      );

      if (matchedNode) {
        const connectedIds = new Set<string>([matchedNode.id]);
        links.forEach((link) => {
          if (link.sourceId === matchedNode.id) connectedIds.add(link.targetId);
          if (link.targetId === matchedNode.id) connectedIds.add(link.sourceId);
        });

        d3.selectAll(".network-node")
          .transition()
          .duration(180)
          .style("opacity", (node: any) => (connectedIds.has(node.id) ? 1 : 0.22));

        d3.selectAll(".network-link")
          .transition()
          .duration(180)
          .style("opacity", (link: any) =>
            link.sourceId === matchedNode.id || link.targetId === matchedNode.id ? 1 : 0.12,
          );
      }
    }

    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (datum: any) => datum.source.x)
        .attr("y1", (datum: any) => datum.source.y)
        .attr("x2", (datum: any) => datum.target.x)
        .attr("y2", (datum: any) => datum.target.y);

      nodeSelection.attr("transform", (datum: any) => `translate(${datum.x},${datum.y})`);

      linkLabels
        .attr("x", (datum: any) => (datum.source.x + datum.target.x) / 2)
        .attr("y", (datum: any) => (datum.source.y + datum.target.y) / 2);
    });

    function dragStarted(event: d3.D3DragEvent<SVGGElement, any, any>, datum: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      datum.fx = datum.x;
      datum.fy = datum.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, any, any>, datum: any) {
      datum.fx = event.x;
      datum.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, any, any>, datum: any) {
      if (!event.active && !isAutoExpand) simulation.alphaTarget(0);
      datum.fx = null;
      datum.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [
    characters,
    i18n.language,
    isAutoExpand,
    onNodeClick,
    relationshipTypes,
    resetKey,
    searchQuery,
    showLabels,
    visibleLinks,
  ]);

  return (
    <div ref={containerRef} className="w-full bg-surface border border-line-soft rounded-sm p-4 mt-8 paper-texture ambient-shadow relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 relative z-10">
        <div>
          <h3 className="font-label-caps text-label-caps text-ink-mute mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">hub</span>
            {i18n.language === "en" ? "Story Relationship Network" : "劇情關係網"}
          </h3>
          <p className="font-mono-metadata text-mono-metadata text-ink-faint">
            {i18n.language === "en"
              ? "Hover to trace linked arcs, drag nodes to inspect clusters, and search for a named figure."
              : "可懸停追蹤關聯劇情、拖曳節點查看聚類，並直接搜尋具名角色。"}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <div className="bg-surface-variant border border-line-soft px-3 py-1.5 rounded-sm flex items-center gap-2 mr-2">
            <span className="material-symbols-outlined text-[14px] text-primary">group</span>
            <span className="font-mono-metadata text-xs text-ink-main">
              <strong>{visibleCount}</strong> <span className="text-ink-mute">/ {characters.length}</span>
            </span>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-ink-faint pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder={i18n.language === "en" ? "Search..." : "搜尋角色..."}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full border border-line-soft bg-surface-variant font-mono-metadata text-xs text-ink-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-32 md:w-44 transition-all placeholder:text-ink-faint"
            />
          </div>

          <div className="w-px h-6 bg-line-soft mx-1 hidden sm:block"></div>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border ${
              showLabels
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {showLabels ? "visibility" : "visibility_off"}
            </span>
            {i18n.language === "en" ? "Labels" : "標籤"}
          </button>

          <button
            onClick={() => setResetKey((prev) => prev + 1)}
            className="font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
          >
            <span className="material-symbols-outlined text-[14px]">my_location</span>
            {i18n.language === "en" ? "Reset View" : "重設視圖"}
          </button>

          <button
            onClick={() => setIsAutoExpand(!isAutoExpand)}
            className={`font-mono-metadata text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors border ${
              isAutoExpand
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-variant border-line-soft text-ink-soft hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isAutoExpand ? "autorenew" : "stop_circle"}
            </span>
            {i18n.language === "en" ? "Auto-Expand" : "自動展開"}
          </button>
        </div>
      </div>

      <svg ref={svgRef} className="w-full h-[420px]" style={{ touchAction: "none" }}></svg>

      <div className="mt-4 pt-4 border-t border-line-soft">
        <h4 className="font-label-caps text-label-caps text-ink-mute mb-3">
          {i18n.language === "en" ? "Connection Types" : "關係類型"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {relationshipTypes.map((type) => {
            const isActive = visibleTypes.has(type.id);
            return (
              <button
                key={type.id}
                onClick={() => {
                  setVisibleTypes((prev) => {
                    const next = new Set(prev);
                    if (next.has(type.id)) {
                      next.delete(type.id);
                    } else {
                      next.add(type.id);
                    }
                    return next;
                  });
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-sm border transition-all text-left ${
                  isActive
                    ? "bg-surface border-line shadow-sm opacity-100"
                    : "bg-surface-variant border-transparent opacity-55 hover:opacity-80"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-[3px] rounded-full" style={{ backgroundColor: type.color }}></div>
                  <span className="font-mono-metadata text-[10px] text-ink-main uppercase tracking-wider font-semibold">
                    {i18n.language === "en" ? type.labelEn : type.labelZh}
                  </span>
                </div>
                <p className="font-mono-metadata text-[10px] text-ink-soft">
                  {i18n.language === "en" ? type.descriptionEn : type.descriptionZh}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
