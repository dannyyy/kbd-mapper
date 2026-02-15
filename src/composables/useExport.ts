import { useProjectStore } from "../stores/project";
import { useThemeStore } from "../stores/theme";
import { downloadText, downloadBlob } from "../utils/download";

export function useExport() {
  const projectStore = useProjectStore();
  const themeStore = useThemeStore();

  function prepareExportSvg(): SVGElement | null {
    const renderer = document.querySelector(".keyboard-renderer");
    if (!renderer) return null;

    const svgs = renderer.querySelectorAll("svg.keyboard-svg");
    if (svgs.length === 0) return null;

    const bg = themeStore.currentTheme.colors.background;
    const gap = 20;

    // For compact mode (single SVG), just clone it
    if (svgs.length === 1) {
      const clone = svgs[0]!.cloneNode(true) as SVGElement;
      cleanSvg(clone);
      addBackground(clone, bg);
      return clone;
    }

    // For expanded mode (multiple SVGs), combine them with layer headers
    let totalHeight = 0;
    let maxWidth = 0;
    const padding = 20;
    const headerHeight = 30;

    // Calculate total dimensions
    const svgDimensions: Array<{ w: number; h: number }> = [];
    svgs.forEach((svg) => {
      const w = parseFloat(svg.getAttribute("width") || "800");
      const h = parseFloat(svg.getAttribute("height") || "400");
      svgDimensions.push({ w, h });
      if (w > maxWidth) maxWidth = w;
      totalHeight += h + headerHeight + gap;
    });

    totalHeight += padding * 2 - gap;
    maxWidth += padding * 2;

    // Create combined SVG
    const combined = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    combined.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    combined.setAttribute("width", String(maxWidth));
    combined.setAttribute("height", String(totalHeight));
    combined.setAttribute("viewBox", `0 0 ${maxWidth} ${totalHeight}`);

    // Background
    const bgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    bgRect.setAttribute("width", String(maxWidth));
    bgRect.setAttribute("height", String(totalHeight));
    bgRect.setAttribute("fill", bg);
    combined.appendChild(bgRect);

    let yOffset = padding;
    const visibleLayers = projectStore.visibleLayers;

    svgs.forEach((svg, i) => {
      const layer = visibleLayers[i];
      if (layer) {
        // Layer header
        const headerGroup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g",
        );
        headerGroup.setAttribute(
          "transform",
          `translate(${padding}, ${yOffset})`,
        );

        const dot = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        dot.setAttribute("cx", "6");
        dot.setAttribute("cy", "12");
        dot.setAttribute("r", "5");
        dot.setAttribute("fill", layer.color);
        headerGroup.appendChild(dot);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        text.setAttribute("x", "18");
        text.setAttribute("y", "16");
        text.setAttribute("font-size", "14");
        text.setAttribute("font-weight", "600");
        text.setAttribute(
          "font-family",
          themeStore.currentTheme.typography.fontFamily,
        );
        text.setAttribute(
          "fill",
          themeStore.currentTheme.colors.legendColors.primary,
        );
        text.textContent = layer.name;
        headerGroup.appendChild(text);

        combined.appendChild(headerGroup);
        yOffset += headerHeight;
      }

      // Clone and position SVG contents
      const clone = svg.cloneNode(true) as SVGElement;
      cleanSvg(clone);
      const dim = svgDimensions[i];

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${padding}, ${yOffset})`);

      // Copy all children from the cloned SVG into the group
      while (clone.firstChild) {
        group.appendChild(clone.firstChild);
      }

      combined.appendChild(group);
      yOffset += dim!.h + gap;
    });

    return combined;
  }

  function cleanSvg(svg: SVGElement) {
    // Remove selection highlights
    svg.querySelectorAll(".keycap.selected rect").forEach(() => {
      // Reset stroke to non-selected state
    });
    // Remove editor-only classes
    svg.querySelectorAll("[class]").forEach((el) => {
      el.removeAttribute("class");
    });
    // Remove cursor styles
    svg.querySelectorAll('[style*="cursor"]').forEach((el) => {
      const style = el.getAttribute("style") || "";
      el.setAttribute("style", style.replace(/cursor:\s*pointer;?\s*/g, ""));
    });
  }

  function addBackground(svg: SVGElement, color: string) {
    const bgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    const vb = svg.getAttribute("viewBox");
    if (vb) {
      const [x, y, w, h] = vb.split(/\s+/).map(Number);
      bgRect.setAttribute("x", String(x));
      bgRect.setAttribute("y", String(y));
      bgRect.setAttribute("width", String(w));
      bgRect.setAttribute("height", String(h));
    } else {
      bgRect.setAttribute("width", svg.getAttribute("width") || "100%");
      bgRect.setAttribute("height", svg.getAttribute("height") || "100%");
    }
    bgRect.setAttribute("fill", color);
    svg.insertBefore(bgRect, svg.firstChild);
  }

  function serializeSvg(svg: SVGElement): string {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    if (!svgString.startsWith("<?xml")) {
      svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
    }
    return svgString;
  }

  async function exportSvg(): Promise<void> {
    const svg = prepareExportSvg();
    if (!svg) throw new Error("No SVG found to export");
    const svgString = serializeSvg(svg);
    downloadText(
      svgString,
      `${projectStore.project.name}.svg`,
      "image/svg+xml",
    );
  }

  async function exportPng(scale: number): Promise<void> {
    const svg = prepareExportSvg();
    if (!svg) throw new Error("No SVG found to export");

    const svgString = serializeSvg(svg);
    const svgWidth = parseFloat(svg.getAttribute("width") || "800");
    const svgHeight = parseFloat(svg.getAttribute("height") || "400");

    const canvas = document.createElement("canvas");
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);

    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
        URL.revokeObjectURL(url);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            downloadBlob(pngBlob, `${projectStore.project.name}.png`);
            resolve();
          } else {
            reject(new Error("Failed to create PNG blob"));
          }
        }, "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG for PNG export"));
      };
      img.src = url;
    });
  }

  async function exportPdf(): Promise<void> {
    const svg = prepareExportSvg();
    if (!svg) throw new Error("No SVG found to export");

    const svgWidth = parseFloat(svg.getAttribute("width") || "800");
    const svgHeight = parseFloat(svg.getAttribute("height") || "400");

    const { jsPDF } = await import("jspdf");
    const { svg2pdf } = await import("svg2pdf.js");

    const isLandscape = svgWidth > svgHeight;
    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "pt",
      format: [svgWidth, svgHeight],
    });

    // Temporarily add SVG to DOM for svg2pdf to read
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.appendChild(svg);
    document.body.appendChild(container);

    try {
      await svg2pdf(svg, pdf, {
        x: 0,
        y: 0,
        width: svgWidth,
        height: svgHeight,
      });
      pdf.save(`${projectStore.project.name}.pdf`);
    } finally {
      document.body.removeChild(container);
    }
  }

  async function exportAs(
    format: "svg" | "png" | "pdf",
    scale = 2,
  ): Promise<void> {
    switch (format) {
      case "svg":
        return exportSvg();
      case "png":
        return exportPng(scale);
      case "pdf":
        return exportPdf();
    }
  }

  return { exportAs, prepareExportSvg, exportSvg, exportPng, exportPdf };
}
