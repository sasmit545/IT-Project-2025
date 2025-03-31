return (
    <div style={{ width: "20%", padding: "10px", borderLeft: "2px solid gray", overflowY: "auto" }}>
        <h3>Style Editor</h3>
        <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Element Type: <span style={{ fontWeight: "normal" }}>{element?.type}</span>
            </label>
        </div>

        <div className="style-section" style={{ marginBottom: "20px" }}>
            <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Text Styles</h4>
            <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Text Color: </label>
                <input
                    type="color"
                    onChange={(e) => updateStyle("color", e.target.value)}
                    value={element?.style?.color || "#000000"}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Font Size: </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="range"
                        min="8"
                        max="72"
                        onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                        style={{ flex: 1 }}
                    />
                    <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                        {Number.parseInt(element?.style?.fontSize) || 16}px
                    </span>
                </div>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Font Size: </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="range"
                        min="8"
                        max="72"
                        onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                        style={{ flex: 1 }}
                    />
                    <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                        {Number.parseInt(selectedElement.style?.fontSize) || 16}px
                    </span>
                </div>
            </div>
        </div>
    </div>
);