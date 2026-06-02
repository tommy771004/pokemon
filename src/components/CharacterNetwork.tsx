import { useEffect, useRef } from "react";
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

export default function CharacterNetwork({ characters, onNodeClick }: NetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || characters.length === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 400; // Fixed height for the visualization

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create a mapping and basic links
    // Ditto (132) is central. Tangrowth (465) connects to Ditto.
    // Others connect to Ditto as well.
    const nodes = characters.map(d => ({ ...d }));
    
    // Determine links dynamically based on protagonist or manual mapping
    const protagonistId = "132"; // Ditto
    
    const links: { source: string; target: string; type: string }[] = [];
    
    nodes.forEach(node => {
      if (node.id === "465") { // Tangrowth -> Ditto
        links.push({ source: node.id, target: protagonistId, type: "Mentors" });
      } else if (node.id !== protagonistId) {
        // Others connect to Protagonist
        links.push({ source: protagonistId, target: node.id, type: "Interacts" });
      }
    });

    // Special connection: Tangrowth (465) also mentors/guides generally, but let's stick to simple star topology around Ditto, 
    // and maybe connect Tinkaton (959) and Greedent (820) if both exist as they are later game.
    const hasTinkaton = nodes.some(n => n.id === "959");
    const hasGreedent = nodes.some(n => n.id === "820");
    if (hasTinkaton && hasGreedent) {
      links.push({ source: "820", target: "959", type: "Skylands Builders" });
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 40) // offset from center of node
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "var(--color-line-soft)")
      .style("stroke", "none");

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--color-line-soft)")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrowhead)");

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes as any)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (e, d: any) => onNodeClick(d));

    // Outer circles
    nodeGroup.append("circle")
      .attr("r", 32)
      .attr("fill", "var(--color-surface-container-high)")
      .attr("stroke", (d: any) => d.roleEn === "Protagonist" ? "var(--color-primary)" : "var(--color-line-soft)")
      .attr("stroke-width", 3);

    // Images
    nodeGroup.append("image")
      .attr("href", (d: any) => d.image)
      .attr("x", -24)
      .attr("y", -24)
      .attr("height", 48)
      .attr("width", 48)
      .attr("clip-path", "circle(24px at center)");

    // Labels
    const labels = nodeGroup.append("text")
      .text((d: any) => i18n.language === "en" ? d.nameEn : d.nameZh)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("font-size", "12px")
      .attr("fill", "var(--color-ink-soft)");

    // Link labels
    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d: any) => d.type)
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono-metadata)")
      .attr("fill", "var(--color-ink-faint)")
      .attr("text-anchor", "middle")
      .attr("dy", -5);

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
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [characters, i18n.language, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full bg-surface border border-line-soft rounded-sm p-4 mt-8 paper-texture ambient-shadow relative overflow-hidden">
        <h3 className="font-label-caps text-label-caps text-ink-mute mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">hub</span>
            {i18n.language === "en" ? "Story Character Relationships" : "劇情角色關係圖"}
        </h3>
        <p className="font-mono-metadata text-mono-metadata text-ink-faint mb-4">
            {i18n.language === "en" 
                ? "Drag characters to interact with the network graph." 
                : "拖曳角色以與關係圖互動。"}
        </p>
      <svg ref={svgRef} className="w-full h-[400px]" style={{ touchAction: "none" }}></svg>
    </div>
  );
}
