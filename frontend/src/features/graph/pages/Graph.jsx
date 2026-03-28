import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getGraph } from "../services/graph.api";

const Graph = () => {
  const svgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGraph();
        setGraphData(data);
      } catch (err) {
        console.error("Graph load error", err);
        setError("Could not load graph data. Make sure you are logged in.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !graphData.nodes.length) return;

    const width = 1000;
    const height = 650;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("border", "1px solid #444")
      .style("overflow", "hidden");

    svg.selectAll("*").remove();

    const container = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "#bbb")
      .attr("stroke-width", (d) => Math.max(1, Math.min(4, d.weight || 1)));

    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", 15)
      .attr("fill", (d) => (d.id === selectedNode?.id ? "#8b5cf6" : "#38bdf8"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
      });

    const label = container
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(graphData.nodes)
      .join("text")
      .text((d) => d.label || d.id)
      .attr("font-size", 12)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", -20);

    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id((d) => d.id).distance(120).strength(0.5))
      .force("charge", d3.forceManyBody().strength(graphData.nodes.length < 5 ? -100 : -250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .on("tick", () => {
        // Constrain nodes within viewBox boundaries with padding
        const padding = 50; // Increased padding for labels
        graphData.nodes.forEach(d => {
          d.x = Math.max(padding, Math.min(width - padding, d.x));
          d.y = Math.max(padding, Math.min(height - padding, d.y));
        });

        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      });

    return () => {
      simulation.stop();
    };
  }, [graphData, selectedNode]);

  return (
    <div className="p-4 text-white bg-[#0b0f18] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Knowledge Graph</h1>
      {error && <div className="p-3 text-red-300 bg-red-900/30 rounded-lg">{error}</div>}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="w-full h-[650px] overflow-hidden border border-white/10 rounded-lg">
            <svg ref={svgRef} className="w-full h-full"></svg>
          </div>
        </div>
        <aside className="w-80 p-4 bg-[#111827] rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold mb-2">Node details</h2>
          {!selectedNode && <p className="text-gray-400">Click a node to see related items</p>}
          {selectedNode && (
            <>
              <p><span className="font-medium">Title:</span> {selectedNode.label}</p>
              <p><span className="font-medium">Id:</span> {selectedNode.id}</p>
              <p><span className="font-medium">Tags:</span> {selectedNode.tags?.join(", ") || "None"}</p>
              <p><span className="font-medium">Collection:</span> {selectedNode.collectionId || "None"}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Graph;
