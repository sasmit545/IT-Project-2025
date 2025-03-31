"use client"

import { useState, useEffect } from "react"
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"

// Enhanced component list with more options
const componentsList = [
    { id: "text", label: "Text", content: "Edit this text", type: "div", style: {}, closing: 1 },
    { id: "button", label: "Button", content: "ClickMe", type: "button", style: {}, closing: 1 },
    {
        id: "container",
        label: "Container",
        content: "",
        type: "div",
        style: { padding: "20px", minHeight: "100px" },
        isContainer: true,
        children: [],
        closing: 1,
    },
    {
        id: "heading",
        label: "Heading",
        content: "Heading",
        type: "h2",
        style: { fontSize: "24px", fontWeight: "bold" },
        closing: 1,
    },
    {
        id: "image",
        label: "Image",
        content: "",
        type: "img",
        style: { width: "100%", maxWidth: "300px" },
        src: "https://via.placeholder.com/300",
        alt: "Placeholder image",
        closing: 0,
    },
    {
        id: "list",
        label: "List",
        content: "<li>Item 1</li><li>Item 2</li><li>Item 3</li>",
        type: "ul",
        style: { paddingLeft: "20px" },
        closing: 1,
    },
    {
        id: "link",
        label: "Link",
        content: "Click here",
        type: "a",
        style: { color: "blue", textDecoration: "underline" },
        href: "#",
        closing: 1,
    },
]

// Added element categories
const componentCategories = [
    { id: "basic", label: "Basic Elements", components: ["text", "heading", "button"] },
    { id: "layout", label: "Layout", components: ["container"] },
    { id: "media", label: "Media", components: ["image"] },
    { id: "navigation", label: "Navigation", components: ["link", "list"] },
]

function DraggableComponent({ id, content }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "none",
        padding: "10px",
        background: "lightblue",
        cursor: "grab",
        marginBottom: "5px",
        borderRadius: "4px",
        transition: "background 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            onMouseOver={(e) => (e.currentTarget.style.background = "#a9d4e4")}
            onMouseOut={(e) => (e.currentTarget.style.background = "lightblue")}
        >
            <span dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    )
}

function ComponentCategoryList({ categories }) {
    const [expandedCategories, setExpandedCategories] = useState(categories.map((cat) => cat.id))

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    return (
        <div>
            {categories.map((category) => (
                <div key={category.id} style={{ marginBottom: "15px" }}>
                    <div
                        onClick={() => toggleCategory(category.id)}
                        style={{
                            padding: "8px",
                            background: "#e0e0e0",
                            cursor: "pointer",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {category.label}
                        <span>{expandedCategories.includes(category.id) ? "▼" : "►"}</span>
                    </div>
                    {expandedCategories.includes(category.id) && (
                        <div style={{ marginTop: "5px" }}>
                            {category.components.map((compId) => {
                                const comp = componentsList.find((c) => c.id === compId)
                                return comp ? <DraggableComponent key={comp.id} id={comp.id} content={comp.label} /> : null
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function NestedDroppable({ component, componentPath, components, setComponents, setSelectedElement }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-${componentPath.join("-")}`,
    })

    const updateContent = (newContent) => {
        const updatedComponents = [...components]
        let currentLevel = updatedComponents

        // Navigate to the correct nesting level except the last index
        for (let i = 0; i < componentPath.length - 1; i++) {
            currentLevel = currentLevel[componentPath[i]].children
        }

        // Update the content
        currentLevel[componentPath[componentPath.length - 1]].content = newContent
        setComponents(updatedComponents)
    }

    const handleDrop = (draggedComponent) => {
        const updatedComponents = [...components]
        let currentLevel = updatedComponents

        // Navigate to the correct nesting level except the last index
        for (let i = 0; i < componentPath.length - 1; i++) {
            if (componentPath[i] === "children") {
                continue // Skip "children" in the path
            }
            if (i < componentPath.length - 2 && componentPath[i + 1] === "children") {
                currentLevel = currentLevel[componentPath[i]].children
            } else {
                currentLevel = currentLevel[componentPath[i]]
            }
        }

        // Add to children array of the target container
        const lastIndex = componentPath[componentPath.length - 1]
        if (!currentLevel[lastIndex].children) {
            currentLevel[lastIndex].children = []
        }
        currentLevel[lastIndex].children.push({
            ...draggedComponent,
            style: { ...draggedComponent.style },
            children: draggedComponent.isContainer ? [] : undefined,
        })

        setComponents(updatedComponents)
    }

    const handleDeleteComponent = (index) => {
        const updatedComponents = [...components]
        let currentLevel = updatedComponents

        // Navigate to the correct nesting level except the last index
        for (let i = 0; i < componentPath.length - 1; i++) {
            if (componentPath[i] === "children") {
                continue // Skip "children" in the path
            }
            if (i < componentPath.length - 2 && componentPath[i + 1] === "children") {
                currentLevel = currentLevel[componentPath[i]].children
            } else {
                currentLevel = currentLevel[componentPath[i]]
            }
        }

        // Remove the child at specified index
        const lastIndex = componentPath[componentPath.length - 1]
        if (currentLevel[lastIndex].children) {
            currentLevel[lastIndex].children.splice(index, 1)
            setComponents(updatedComponents)
        }
    }

    // This will be used by the parent DndContext
    component.handleDrop = handleDrop

    const containerStyle = {
        ...component.style,
        background: isOver ? "rgba(144, 238, 144, 0.3)" : component.style.background || "transparent",
        position: "relative",
        transition: "all 0.2s ease",
        border: component.style.border || (isOver ? "1px dashed #4CAF50" : "1px dashed #ccc"),
    }

    return (
        <div
            ref={setNodeRef}
            style={containerStyle}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement({ path: componentPath, ...component })
            }}
        >
            {component.content && (
                <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateContent(e.target.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: component.content }}
                    style={{ marginBottom: "10px" }}
                />
            )}

            {component.children &&
                component.children.map((childComp, childIndex) => (
                    <div key={childIndex} style={{ position: "relative" }}>
                        <RenderComponent
                            component={childComp}
                            componentPath={[...componentPath, "children", childIndex]}
                            components={components}
                            setComponents={setComponents}
                            setSelectedElement={setSelectedElement}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteComponent(childIndex)
                            }}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "12px",
                                opacity: "0.8",
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

            {component.isContainer && component.children.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>Drop components here</div>
            )}
        </div>
    )
}

function RenderComponent({ component, componentPath, components, setComponents, setSelectedElement }) {
    if (component.isContainer) {
        return (
            <NestedDroppable
                component={component}
                componentPath={componentPath}
                components={components}
                setComponents={setComponents}
                setSelectedElement={setSelectedElement}
            />
        )
    }

    const updateContent = (newContent) => {
        const updatedComponents = [...components]
        let currentLevel = updatedComponents

        // Navigate to the correct nesting level
        for (let i = 0; i < componentPath.length; i++) {
            if (componentPath[i] === "children") {
                continue
            }
            if (i === componentPath.length - 1) {
                currentLevel[componentPath[i]].content = newContent
            } else if (i < componentPath.length - 2 && componentPath[i + 1] === "children") {
                currentLevel = currentLevel[componentPath[i]].children
            } else {
                currentLevel = currentLevel[componentPath[i]]
            }
        }

        setComponents(updatedComponents)
    }

    const ComponentType = component.type

    const props = {
        style: component.style,
        onClick: (e) => {
            e.stopPropagation()
            setSelectedElement({ path: componentPath, ...component })
        },
    }

    // Handle special component types
    if (ComponentType === "img") {
        return <img src={component.src || "https://via.placeholder.com/300"} alt={component.alt || "Image"} {...props} />
    } else if (ComponentType === "a") {
        return (
            <a
                href={component.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
                dangerouslySetInnerHTML={{ __html: component.content }}
            />
        )
    }

    // Regular components with content
    return (
        <ComponentType
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateContent(e.target.innerHTML)}
            {...props}
            dangerouslySetInnerHTML={{ __html: component.content }}
        />
    )
}

function Canvas({ components, setComponents, setSelectedElement }) {
    const { setNodeRef, isOver } = useDroppable({ id: "canvas" })
    const [historyStack, setHistoryStack] = useState([])
    const [futureStack, setFutureStack] = useState([])

    useEffect(() => {
        // Save current state to history when components change (debounced)
        const debounceTimer = setTimeout(() => {
            if (
                historyStack.length === 0 ||
                JSON.stringify(historyStack[historyStack.length - 1]) !== JSON.stringify(components)
            ) {
                setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(components))])
                setFutureStack([])
            }
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [components])

    const handleDeleteComponent = (index) => {
        setComponents((prevComponents) => {
            const newComponents = [...prevComponents]
            newComponents.splice(index, 1)
            return newComponents
        })
    }

    const handleUndo = () => {
        if (historyStack.length > 1) {
            const newHistoryStack = [...historyStack]
            const currentState = newHistoryStack.pop()
            setHistoryStack(newHistoryStack)
            setFutureStack((prev) => [...prev, currentState])
            setComponents(newHistoryStack[newHistoryStack.length - 1])
        }
    }

    const handleRedo = () => {
        if (futureStack.length > 0) {
            const newFutureStack = [...futureStack]
            const nextState = newFutureStack.pop()
            setFutureStack(newFutureStack)
            setHistoryStack((prev) => [...prev, nextState])
            setComponents(nextState)
        }
    }

    return (
        <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px", background: "#f0f0f0", display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                    onClick={handleUndo}
                    disabled={historyStack.length <= 1}
                    style={{
                        opacity: historyStack.length <= 1 ? 0.5 : 1,
                        cursor: historyStack.length <= 1 ? "not-allowed" : "pointer",
                    }}
                >
                    Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={futureStack.length === 0}
                    style={{
                        opacity: futureStack.length === 0 ? 0.5 : 1,
                        cursor: futureStack.length === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    Redo
                </button>
            </div>

            <div
                ref={setNodeRef}
                style={{
                    minHeight: "400px",
                    border: "2px dashed gray",
                    background: isOver ? "lightgreen" : "white",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    overflow: "auto",
                    flex: 1,
                    position: "relative",
                }}
            >
                {components.length === 0 ? <p>Drag elements here</p> : null}
                {components.map((comp, index) => (
                    <div key={index} style={{ position: "relative", margin: "5px 0" }}>
                        <RenderComponent
                            component={comp}
                            componentPath={[index]}
                            components={components}
                            setComponents={setComponents}
                            setSelectedElement={setSelectedElement}
                        />
                        <button
                            onClick={() => handleDeleteComponent(index)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "12px",
                                opacity: "0.8",
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}


function RightPanel({ selectedElement, setComponents, components }) {
    const [element, setElement] = useState(selectedElement);

    useEffect(() => {
        setElement(selectedElement);
    }, [selectedElement]);

    if (!selectedElement)
        return (
            <div style={{ width: "20%", padding: "10px", borderLeft: "2px solid gray" }}>
                <h3>Style Editor</h3>
                <p>Select an element to edit its properties</p>
            </div>
        );

    const updateStyle = (property, value) => {
        const updatedComponents = [...components];

        let currentLevel = updatedComponents;
        const path = selectedElement.path;

        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                const currentStyle = currentLevel[path[i]].style || {};
                currentLevel[path[i]] = {
                    ...currentLevel[path[i]], // Ensure immutability
                    style: {
                        ...currentStyle,
                        [property]: value,
                    },
                };
            } else if (path[i] === "children") {
                currentLevel = currentLevel.children;
            } else {
                currentLevel = currentLevel[path[i]];
            }
        }

        setComponents([...updatedComponents]); // Ensure new reference
        setElement({ ...element, style: { ...element.style, [property]: value } }); // Update local state
    };

    const updateAttribute = (attribute, value) => {
        const updatedComponents = [...components];

        let currentLevel = updatedComponents;
        const path = selectedElement.path;

        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                currentLevel[path[i]][attribute] = value;
            } else if (path[i] === "children") {
                currentLevel = currentLevel.children;
            } else {
                currentLevel = currentLevel[path[i]];
            }
        }

        setComponents([...updatedComponents]); // Ensure re-render
        setElement({ ...element, [attribute]: value }); // Update local state
    };

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
                    <label style={{ display: "block", marginBottom: "5px" }}>Font Weight: </label>
                    <select
                        onChange={(e) => updateStyle("fontWeight", e.target.value)}
                        value={element?.style?.fontWeight || "normal"}
                        style={{ width: "100%" }}
                    >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Lighter</option>
                    </select>
                </div>



            </div>
            <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Text Align: </label>
                <div style={{ display: "flex", gap: "5px" }}>
                    <button
                        onClick={() => updateStyle("textAlign", "left")}
                        style={{
                            flex: 1,
                            background: element?.style?.textAlign === "left" ? "#ddd" : "#f5f5f5",
                            padding: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        Left
                    </button>
                    <button
                        onClick={() => updateStyle("textAlign", "center")}
                        style={{
                            flex: 1,
                            background: element?.style?.textAlign === "center" ? "#ddd" : "#f5f5f5",
                            padding: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        Center
                    </button>
                    <button
                        onClick={() => updateStyle("textAlign", "right")}
                        style={{
                            flex: 1,
                            background: element?.style?.textAlign === "right" ? "#ddd" : "#f5f5f5",
                            padding: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        Right
                    </button>
                </div>
            </div>
            <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px" }}>Display Type:</label>
    <div style={{ display: "flex", gap: "5px" }}>
        <button
            onClick={() => updateStyle("display", "block")}
            style={{
                flex: 1,
                background: element?.style?.display === "block" ? "#ddd" : "#f5f5f5",
                padding: "5px",
                border: "1px solid #ccc",
            }}
        >
            Block
        </button>
        <button
            onClick={() => updateStyle("display", "inline")}
            style={{
                flex: 1,
                background: element?.style?.display === "inline" ? "#ddd" : "#f5f5f5",
                padding: "5px",
                border: "1px solid #ccc",
            }}
        >
            Inline
        </button>
        <button
            onClick={() => updateStyle("display", "flex")}
            style={{
                flex: 1,
                background: element?.style?.display === "flex" ? "#ddd" : "#f5f5f5",
                padding: "5px",
                border: "1px solid #ccc",
            }}
        >
            Flex
        </button>
    </div>

    {/* Show Justify Content options only when display is Flex */}
    {element?.style?.display === "flex" && (
        <div style={{ marginTop: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Justify Content:</label>
            <div 
                style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(3, 1fr)", 
                    gap: "5px" 
                }}
            >
                <button
                    onClick={() => updateStyle("justifyContent", "flex-start")}
                    style={{
                        background: element?.style?.justifyContent === "flex-start" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Left
                </button>
                <button
                    onClick={() => updateStyle("justifyContent", "center")}
                    style={{
                        background: element?.style?.justifyContent === "center" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Center
                </button>
                <button
                    onClick={() => updateStyle("justifyContent", "flex-end")}
                    style={{
                        background: element?.style?.justifyContent === "flex-end" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Right
                </button>
                <button
                    onClick={() => updateStyle("justifyContent", "space-between")}
                    style={{
                        background: element?.style?.justifyContent === "space-between" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Space Between
                </button>
                <button
                    onClick={() => updateStyle("justifyContent", "space-around")}
                    style={{
                        background: element?.style?.justifyContent === "space-around" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Space Around
                </button>
                <button
                    onClick={() => updateStyle("justifyContent", "space-evenly")}
                    style={{
                        background: element?.style?.justifyContent === "space-evenly" ? "#ddd" : "#f5f5f5",
                        padding: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    Space Evenly
                </button>
            </div>
        </div>
    )}
</div>

            <div className="style-section" style={{ marginBottom: "20px" }}>
                <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Box Styles</h4>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Background: </label>
                    <input
                        type="color"
                        onChange={(e) => updateStyle("background", e.target.value)}
                        value={element?.style?.background || "#FFFFFF"}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Padding: </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            onChange={(e) => updateStyle("padding", `${e.target.value}px`)}
                            value={Number.parseInt(element?.style?.padding) || 0}
                            style={{ flex: 1 }}
                        />
                        <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                            {Number.parseInt(element?.style?.padding) || 0}px
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Margin: </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            onChange={(e) => updateStyle("margin", `${e.target.value}px`)}
                            value={Number.parseInt(element?.style?.margin) || 0}
                            style={{ flex: 1 }}
                        />
                        <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                            {Number.parseInt(element?.style?.margin) || 0}px
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Border Radius: </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            onChange={(e) => updateStyle("borderRadius", `${e.target.value}px`)}
                            value={Number.parseInt(element?.style?.borderRadius) || 0}
                            style={{ flex: 1 }}
                        />
                        <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                            {Number.parseInt(element?.style?.borderRadius) || 0}px
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Border: </label>
                    <select
                        onChange={(e) => updateStyle("border", e.target.value)}
                        value={element?.style?.border || "none"}
                        style={{ width: "100%" }}
                    >
                        <option value="none">None</option>
                        <option value="1px solid black">Thin</option>
                        <option value="2px solid black">Medium</option>
                        <option value="3px solid black">Thick</option>
                        <option value="1px dashed #ccc">Dashed</option>
                        <option value="1px dotted #ccc">Dotted</option>
                    </select>
                </div>
            </div>
            {element?.type === "a" && (
                <div className="attribute-section" style={{ marginBottom: "20px" }}>
                    <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Link Settings</h4>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>URL: </label>
                        <input
                            type="text"
                            onChange={(e) => updateAttribute("href", e.target.value)}
                            value={element?.href || "#"}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Opens in: </label>
                        <select
                            onChange={(e) => updateAttribute("target", e.target.value)}
                            value={element?.target || "_self"}
                            style={{ width: "100%" }}
                        >
                            <option value="_self">Same Window</option>
                            <option value="_blank">New Window</option>
                        </select>
                    </div>
                </div>
            )}
    {element?.type === "img" && (
        <div className="attribute-section" style={{ marginBottom: "20px" }}>
          <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Image Settings</h4>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Image URL: </label>
            <input
              type="text"
              onChange={(e) => updateAttribute("src", e.target.value)}
              value={element?.src || ""}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Alt Text: </label>
            <input
              type="text"
              onChange={(e) => updateAttribute("alt", e.target.value)}
              value={element?.alt || ""}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      {element?.isContainer && (
        <div className="container-section" style={{ marginBottom: "20px" }}>
          <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Container Settings</h4>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Width: </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min="10"
                max="100"
                onChange={(e) => updateStyle("width", `${e.target.value}%`)}
                value={Number.parseInt(element?.style?.width) || 100}
                style={{ flex: 1 }}
              />
              <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                {Number.parseInt(element?.style?.width) || 100}%
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Min Height: </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min="50"
                max="500"
                onChange={(e) => updateStyle("minHeight", `${e.target.value}px`)}
                value={Number.parseInt(element?.style?.minHeight) || 100}
                style={{ flex: 1 }}
              />
              <span style={{ marginLeft: "10px", minWidth: "30px" }}>
                {Number.parseInt(element?.style?.minHeight) || 100}px
              </span>
            </div>
          </div>
        </div>
      )}

      {element?.type === "button" && (
        <div className="button-section" style={{ marginBottom: "20px" }}>
          <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Button Settings</h4>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Cursor: </label>
            <select
              onChange={(e) => updateStyle("cursor", e.target.value)}
              value={element?.style?.cursor || "pointer"}
              style={{ width: "100%" }}
            >
              <option value="pointer">Pointer</option>
              <option value="default">Default</option>
              <option value="not-allowed">Not Allowed</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() => {
                updateStyle("background", "#4CAF50")
                updateStyle("color", "white")
                updateStyle("border", "none")
                updateStyle("padding", "10px 20px")
                updateStyle("borderRadius", "4px")
                updateStyle("cursor", "pointer")
              }}
              style={{ width: "100%", marginBottom: "5px" }}
            >
              Apply Green Button Style
            </button>

            <button
              onClick={() => {
                updateStyle("background", "#f44336")
                updateStyle("color", "white")
                updateStyle("border", "none")
                updateStyle("padding", "10px 20px")
                updateStyle("borderRadius", "4px")
                updateStyle("cursor", "pointer")
              }}
              style={{ width: "100%", marginBottom: "5px" }}
            >
              Apply Red Button Style
            </button>

            <button
              onClick={() => {
                updateStyle("background", "#2196F3")
                updateStyle("color", "white")
                updateStyle("border", "none")
                updateStyle("padding", "10px 20px")
                updateStyle("borderRadius", "4px")
                updateStyle("cursor", "pointer")
              }}
              style={{ width: "100%", marginBottom: "5px" }}
            >
              Apply Blue Button Style
            </button>
          </div>
        </div>
      )}


        </div >
    );
}



function PreviewModal({ components, isOpen, setIsOpen }) {
    if (!isOpen) return null

    const renderComponentToHTML = (comp) => {
        const styleStr = Object.entries(comp.style || {})
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ")

        // Handle self-closing tags
        if (comp.closing === 0) {
            return `<${comp.type} style="${styleStr}" ${comp.src ? `src="${comp.src}"` : ""} ${comp.alt ? `alt="${comp.alt}"` : ""} />`
        }

        // Handle container with children
        let childrenHTML = ""
        if (comp.children && comp.children.length > 0) {
            childrenHTML = comp.children.map((child) => renderComponentToHTML(child)).join("")
        }

        return `<${comp.type} style="${styleStr}" ${comp.href ? `href="${comp.href}"` : ""}>${comp.content || ""}${childrenHTML}</${comp.type}>`
    }

    const htmlOutput = components.map((comp) => renderComponentToHTML(comp)).join("")

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "80%",
                    height: "80%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    ×
                </button>

                <h2 style={{ marginBottom: "20px" }}>Preview</h2>

                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <button
                        onClick={() => {
                            const blob = new Blob([htmlOutput], { type: "text/html" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "page.html"
                            a.click()
                            URL.revokeObjectURL(url)
                        }}
                        style={{
                            padding: "8px 16px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Export HTML
                    </button>

                    <button
                        onClick={() => {
                            const jsonStr = JSON.stringify(components, null, 2)
                            const blob = new Blob([jsonStr], { type: "application/json" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "components.json"
                            a.click()
                            URL.revokeObjectURL(url)
                        }}
                        style={{
                            padding: "8px 16px",
                            background: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Export JSON
                    </button>
                </div>

                <div
                    style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        padding: "20px",
                        overflow: "auto",
                        background: "#fff",
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
                </div>

                <div
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        maxHeight: "200px",
                        overflow: "auto",
                    }}
                >
                    <h3 style={{ marginBottom: "10px" }}>HTML Output</h3>
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>{htmlOutput}</pre>
                </div>
            </div>
        </div>
    )
}

function CodeExportModal({ components, isOpen, setIsOpen }) {
    if (!isOpen) return null

    const generateReactCode = () => {
        const imports = `import React from 'react';\n\n`

        const renderComponentToJSX = (comp, indent = 0) => {
            const indentStr = " ".repeat(indent * 2)
            const styleObj = JSON.stringify(comp.style || {}, null, 2)
                .replace(/"/g, "")
                .replace(/,\n/g, ",\n" + indentStr + "  ")

            // Handle self-closing tags
            if (comp.closing === 0) {
                return `${indentStr}<${comp.type}\n${indentStr}  style={${styleObj}}\n${indentStr}  ${comp.src ? `src="${comp.src}"` : ""}\n${indentStr}  ${comp.alt ? `alt="${comp.alt}"` : ""}\n${indentStr}/>`
            }

            // Handle container with children
            let childrenJSX = ""
            if (comp.children && comp.children.length > 0) {
                childrenJSX = comp.children.map((child) => renderComponentToJSX(child, indent + 1)).join("\n")
                return `${indentStr}<${comp.type} style={${styleObj}} ${comp.href ? `href="${comp.href}"` : ""}>\n${comp.content ? `${indentStr}  ${comp.content}\n` : ""}${childrenJSX}\n${indentStr}</${comp.type}>`
            }

            return `${indentStr}<${comp.type} style={${styleObj}} ${comp.href ? `href="${comp.href}"` : ""}>${comp.content || ""}</${comp.type}>`
        }

        const componentJSX = components.map((comp) => renderComponentToJSX(comp)).join("\n")

        return `${imports}export default function GeneratedComponent() {
  return (
    <div>
${componentJSX}
    </div>
  );
}`
    }

    const reactCode = generateReactCode()

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "80%",
                    height: "80%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    ×
                </button>

                <h2 style={{ marginBottom: "20px" }}>Export React Code</h2>

                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <button
                        onClick={() => {
                            const blob = new Blob([reactCode], { type: "text/javascript" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "GeneratedComponent.jsx"
                            a.click()
                            URL.revokeObjectURL(url)
                        }}
                        style={{
                            padding: "8px 16px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Download React Component
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(reactCode)
                            alert("Code copied to clipboard!")
                        }}
                        style={{
                            padding: "8px 16px",
                            background: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Copy to Clipboard
                    </button>
                </div>

                <div
                    style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        padding: "20px",
                        overflow: "auto",
                        background: "#f8f8f8",
                        fontFamily: "monospace",
                    }}
                >
                    <pre style={{ whiteSpace: "pre-wrap" }}>{reactCode}</pre>
                </div>
            </div>
        </div>
    )
}

export default function PageBuilder() {
    const [components, setComponents] = useState([])
    const [selectedElement, setSelectedElement] = useState(null)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [isCodeExportModalOpen, setIsCodeExportModalOpen] = useState(false)

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (!over) return

        if (over.id === "canvas") {
            // Find the component in the componentsList
            const draggedComponentTemplate = componentsList.find((comp) => comp.id === active.id)

            if (draggedComponentTemplate) {
                // Create a new instance of the component
                const newComponent = {
                    ...draggedComponentTemplate,
                    style: { ...draggedComponentTemplate.style },
                    children: draggedComponentTemplate.isContainer ? [] : undefined,
                }

                // Add to the components array
                setComponents((prevComponents) => [...prevComponents, newComponent])
            }
        } else if (over.id.startsWith("droppable-")) {
            // Handle dropping into a nested container
            const draggedComponentTemplate = componentsList.find((comp) => comp.id === active.id)

            if (draggedComponentTemplate) {
                // Find the target container
                const pathParts = over.id.replace("droppable-", "").split("-")
                let currentLevel = components
                let targetContainer = null
                const targetPath = []

                for (let i = 0; i < pathParts.length; i++) {
                    const part = pathParts[i]
                    if (part === "children") continue

                    const index = Number.parseInt(part)
                    targetPath.push(index)

                    if (i === pathParts.length - 1) {
                        targetContainer = currentLevel[index]
                    } else if (i < pathParts.length - 2 && pathParts[i + 1] === "children") {
                        currentLevel = currentLevel[index].children
                        targetPath.push("children")
                    } else {
                        currentLevel = currentLevel[index]
                    }
                }

                if (targetContainer && targetContainer.isContainer) {
                    // Create a new component instance
                    const newComponent = {
                        ...draggedComponentTemplate,
                        style: { ...draggedComponentTemplate.style },
                        children: draggedComponentTemplate.isContainer ? [] : undefined,
                    }

                    // Update the components state
                    const updatedComponents = [...components]
                    let current = updatedComponents

                    for (let i = 0; i < targetPath.length; i++) {
                        if (targetPath[i] === "children") {
                            continue
                        }
                        if (i === targetPath.length - 1) {
                            if (!current[targetPath[i]].children) {
                                current[targetPath[i]].children = []
                            }
                            current[targetPath[i]].children.push(newComponent)
                        } else if (i < targetPath.length - 2 && targetPath[i + 1] === "children") {
                            current = current[targetPath[i]].children
                        } else {
                            current = current[targetPath[i]]
                        }
                    }

                    setComponents(updatedComponents)
                }
            }
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
                <div style={{ width: "20%", padding: "10px", borderRight: "2px solid gray", overflowY: "auto" }}>
                    <h2 style={{ marginBottom: "15px" }}>Components</h2>
                    <ComponentCategoryList categories={componentCategories} />
                </div>

                <Canvas components={components} setComponents={setComponents} setSelectedElement={setSelectedElement} />

                <RightPanel selectedElement={selectedElement} setComponents={setComponents} components={components} />

                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        style={{
                            padding: "10px 20px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                    >
                        Preview
                    </button>

                    <button
                        onClick={() => setIsCodeExportModalOpen(true)}
                        style={{
                            padding: "10px 20px",
                            background: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                    >
                        Export Code
                    </button>
                </div>
            </div>

            <PreviewModal components={components} isOpen={isPreviewModalOpen} setIsOpen={setIsPreviewModalOpen} />

            <CodeExportModal components={components} isOpen={isCodeExportModalOpen} setIsOpen={setIsCodeExportModalOpen} />
        </DndContext>
    )
}

