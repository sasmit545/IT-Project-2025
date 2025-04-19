"use client"

import { useState, useEffect } from "react"
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import "./editor.css"

// Enhanced component list with more options
const componentsList = [
  {
    id: "text",
    label: "Text",
    content: "Edit this text",
    type: "div",
    style: {},
    closing: 1,
  },
  {
    id: "button",
    label: "Button",
    content: "ClickMe",
    type: "button",
    style: {},
    closing: 1,
  },
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
  {
    id: "input-text",
    label: "Text Input",
    content: "Enter text",
    type: "text",
    style: {
      width: "100%",
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    placeholder: "Enter text",
    closing: 0,
  },
  {
    id: "input-email",
    label: "Email Input",
    content: "Enter text",
    type: "email",
    style: {
      width: "100%",
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    placeholder: "Enter text",
    closing: 0,
  },
]

// Added element categories
const componentCategories = [
  {
    id: "basic",
    label: "Basic Elements",
    components: ["text", "heading", "button"],
  },
  { id: "layout", label: "Layout", components: ["container"] },
  { id: "media", label: "Media", components: ["image"] },
  { id: "navigation", label: "Navigation", components: ["link", "list"] },
  { id: "forms", label: "Forms", components: ["input-text", "input-email"] },
]

function DraggableComponent({ id, content }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "none",
    width: "100px",
    height: "100px",
    color: "#fff",
    backgroundColor: "#1a1a1a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    transition: "all 0.2s ease",
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#222222"
        e.currentTarget.style.transform = "scale(1.02)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#1a1a1a"
        e.currentTarget.style.transform = "scale(1)"
      }}
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
        <div
          key={category.id}
          style={{
            marginBottom: "15px",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          <div
            onClick={() => toggleCategory(category.id)}
            style={{
              padding: "8px",
              background: "#1a1a1a",
              borderBottom: "2px solid #333",
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
            <div
              style={{
                marginTop: "5px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
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
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <button
          onClick={handleUndo}
          disabled={historyStack.length <= 1}
          className={`toolbar-button ${historyStack.length <= 1 ? "disabled" : ""}`}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={futureStack.length === 0}
          className={`toolbar-button ${futureStack.length === 0 ? "disabled" : ""}`}
        >
          Redo
        </button>
      </div>

      <div ref={setNodeRef} className={`canvas-area ${isOver ? "drop-active" : ""}`}>
        {components.length === 0 ? <p className="canvas-placeholder">Drag elements here</p> : null}
        {components.map((comp, index) => (
          <div key={index} className="canvas-item">
            <RenderComponent
              component={comp}
              componentPath={[index]}
              components={components}
              setComponents={setComponents}
              setSelectedElement={setSelectedElement}
            />
            <button onClick={() => handleDeleteComponent(index)} className="delete-button">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RightPanel({ selectedElement, setComponents, components, rightSidebarOpen }) {
  const [element, setElement] = useState(selectedElement)

  useEffect(() => {
    setElement(selectedElement)
  }, [selectedElement])

  if (!selectedElement)
    return (
      <div className={`right-panel empty-panel ${rightSidebarOpen ? "open" : "closed"}`}>
        <h3>Style Editor</h3>
        <p>Select an element to edit its properties</p>
      </div>
    )

  const updateStyle = (property, value) => {
    const updatedComponents = [...components]

    let currentLevel = updatedComponents
    const path = selectedElement.path

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        const currentStyle = currentLevel[path[i]].style || {}
        currentLevel[path[i]] = {
          ...currentLevel[path[i]], // Ensure immutability
          style: {
            ...currentStyle,
            [property]: value,
          },
        }
      } else if (path[i] === "children") {
        currentLevel = currentLevel.children
      } else {
        currentLevel = currentLevel[path[i]]
      }
    }

    setComponents([...updatedComponents]) // Ensure new reference
    setElement({ ...element, style: { ...element.style, [property]: value } }) // Update local state
  }

  const updateAttribute = (attribute, value) => {
    const updatedComponents = [...components]

    let currentLevel = updatedComponents
    const path = selectedElement.path

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        currentLevel[path[i]][attribute] = value
      } else if (path[i] === "children") {
        currentLevel = currentLevel.children
      } else {
        currentLevel = currentLevel[path[i]]
      }
    }

    setComponents([...updatedComponents]) // Ensure re-render
    setElement({ ...element, [attribute]: value }) // Update local state
  }

  return (
    <div className={`right-panel ${rightSidebarOpen ? "open" : "closed"}`}>
      <h3>Style Editor</h3>
      <div className="element-type">
        <label>
          Element Type: <span>{element?.type}</span>
        </label>
      </div>

      <div className="style-section">
        <h4>Text Styles</h4>
        <div className="style-control">
          <label>Text Color: </label>
          <input
            type="color"
            onChange={(e) => updateStyle("color", e.target.value)}
            value={element?.style?.color || "#000000"}
          />
        </div>

        <div className="style-control">
          <label>Font Size: </label>
          <div className="range-control">
            <input
              type="range"
              min="8"
              max="72"
              onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
              value={Number.parseInt(element?.style?.fontSize) || 16}
            />
            <span className="range-value">{Number.parseInt(element?.style?.fontSize) || 16}px</span>
          </div>
        </div>

        <div className="style-control">
          <label>Font Weight: </label>
          <select
            onChange={(e) => updateStyle("fontWeight", e.target.value)}
            value={element?.style?.fontWeight || "normal"}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>
        </div>
      </div>

      <div className="style-control">
        <label>Text Align: </label>
        <div className="button-group">
          <button
            onClick={() => updateStyle("textAlign", "left")}
            className={element?.style?.textAlign === "left" ? "active" : ""}
          >
            Left
          </button>
          <button
            onClick={() => updateStyle("textAlign", "center")}
            className={element?.style?.textAlign === "center" ? "active" : ""}
          >
            Center
          </button>
          <button
            onClick={() => updateStyle("textAlign", "right")}
            className={element?.style?.textAlign === "right" ? "active" : ""}
          >
            Right
          </button>
        </div>
      </div>

      <div className="style-control">
        <label>Display Type:</label>
        <div className="button-group">
          <button
            onClick={() => updateStyle("display", "block")}
            className={element?.style?.display === "block" ? "active" : ""}
          >
            Block
          </button>
          <button
            onClick={() => updateStyle("display", "inline")}
            className={element?.style?.display === "inline" ? "active" : ""}
          >
            Inline
          </button>
          <button
            onClick={() => updateStyle("display", "flex")}
            className={element?.style?.display === "flex" ? "active" : ""}
          >
            Flex
          </button>
        </div>
      </div>

      {element?.style?.display === "flex" && (
        <div className="style-control">
          <label>Justify Content:</label>
          <div className="button-grid">
            <button
              onClick={() => updateStyle("justifyContent", "flex-start")}
              className={element?.style?.justifyContent === "flex-start" ? "active" : ""}
            >
              Left
            </button>
            <button
              onClick={() => updateStyle("justifyContent", "center")}
              className={element?.style?.justifyContent === "center" ? "active" : ""}
            >
              Center
            </button>
            <button
              onClick={() => updateStyle("justifyContent", "flex-end")}
              className={element?.style?.justifyContent === "flex-end" ? "active" : ""}
            >
              Right
            </button>
            <button
              onClick={() => updateStyle("justifyContent", "space-between")}
              className={element?.style?.justifyContent === "space-between" ? "active" : ""}
            >
              Space Between
            </button>
            <button
              onClick={() => updateStyle("justifyContent", "space-around")}
              className={element?.style?.justifyContent === "space-around" ? "active" : ""}
            >
              Space Around
            </button>
            <button
              onClick={() => updateStyle("justifyContent", "space-evenly")}
              className={element?.style?.justifyContent === "space-evenly" ? "active" : ""}
            >
              Space Evenly
            </button>
          </div>
        </div>
      )}

      <div className="style-section">
        <h4>Box Styles</h4>
        <div className="style-control">
          <label>Background: </label>
          <input
            type="color"
            onChange={(e) => updateStyle("background", e.target.value)}
            value={element?.style?.background || "#FFFFFF"}
          />
        </div>

        <div className="style-control">
          <label>Padding: </label>
          <div className="range-control">
            <input
              type="range"
              min="0"
              max="50"
              onChange={(e) => updateStyle("padding", `${e.target.value}px`)}
              value={Number.parseInt(element?.style?.padding) || 0}
            />
            <span className="range-value">{Number.parseInt(element?.style?.padding) || 0}px</span>
          </div>
        </div>

        <div className="style-control">
          <label>Margin: </label>
          <div className="range-control">
            <input
              type="range"
              min="0"
              max="50"
              onChange={(e) => updateStyle("margin", `${e.target.value}px`)}
              value={Number.parseInt(element?.style?.margin) || 0}
            />
            <span className="range-value">{Number.parseInt(element?.style?.margin) || 0}px</span>
          </div>
        </div>

        <div className="style-control">
          <label>Border Radius: </label>
          <div className="range-control">
            <input
              type="range"
              min="0"
              max="50"
              onChange={(e) => updateStyle("borderRadius", `${e.target.value}px`)}
              value={Number.parseInt(element?.style?.borderRadius) || 0}
            />
            <span className="range-value">{Number.parseInt(element?.style?.borderRadius) || 0}px</span>
          </div>
        </div>

        <div className="style-control">
          <label>Border: </label>
          <select onChange={(e) => updateStyle("border", e.target.value)} value={element?.style?.border || "none"}>
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
        <div className="style-section">
          <h4>Link Settings</h4>
          <div className="style-control">
            <label>URL: </label>
            <input type="text" onChange={(e) => updateAttribute("href", e.target.value)} value={element?.href || "#"} />
          </div>
          <div className="style-control">
            <label>Opens in: </label>
            <select onChange={(e) => updateAttribute("target", e.target.value)} value={element?.target || "_self"}>
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>
        </div>
      )}

      {element?.type === "img" && (
        <div className="style-section">
          <h4>Image Settings</h4>
          <div className="style-control">
            <label>Image URL: </label>
            <input type="text" onChange={(e) => updateAttribute("src", e.target.value)} value={element?.src || ""} />
          </div>
          <div className="style-control">
            <label>Alt Text: </label>
            <input type="text" onChange={(e) => updateAttribute("alt", e.target.value)} value={element?.alt || ""} />
          </div>
        </div>
      )}

      {element?.isContainer && (
        <div className="style-section">
          <h4>Container Settings</h4>
          <div className="style-control">
            <label>Width: </label>
            <div className="range-control">
              <input
                type="range"
                min="10"
                max="100"
                onChange={(e) => updateStyle("width", `${e.target.value}%`)}
                value={Number.parseInt(element?.style?.width) || 100}
              />
              <span className="range-value">{Number.parseInt(element?.style?.width) || 100}%</span>
            </div>
          </div>

          <div className="style-control">
            <label>Min Height: </label>
            <div className="range-control">
              <inputt
                type="range"
                min="50"
                max="500"
                onChange={(e) => updateStyle("minHeight", `${e.target.value}px`)}
                value={Number.parseInt(element?.style?.minHeight) || 100}
              />
              <span className="range-value">{Number.parseInt(element?.style?.minHeight) || 100}px</span>
            </div>
          </div>
        </div>
      )}

      {element?.type === "button" && (
        <div className="style-section">
          <h4>Button Settings</h4>
          <div className="style-control">
            <label>Cursor: </label>
            <select onChange={(e) => updateStyle("cursor", e.target.value)} value={element?.style?.cursor || "pointer"}>
              <option value="pointer">Pointer</option>
              <option value="default">Default</option>
              <option value="not-allowed">Not Allowed</option>
            </select>
          </div>

          <div className="style-control button-presets">
            <button
              onClick={() => {
                updateStyle("background", "#4CAF50")
                updateStyle("color", "white")
                updateStyle("border", "none")
                updateStyle("padding", "10px 20px")
                updateStyle("borderRadius", "4px")
                updateStyle("cursor", "pointer")
              }}
              className="preset-button green"
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
              className="preset-button red"
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
              className="preset-button blue"
            >
              Apply Blue Button Style
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PreviewModal({ components, isOpen, setIsOpen }) {
  if (!isOpen) return null

  const renderComponentToHTML = (comp) => {
    const styleStr = Object.entries(comp.style || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ")

    // Handle self-closing tags
    if (comp.closing === 0) {
      return `<${comp.type} style="${styleStr}" ${
        comp.src ? `src="${comp.src}"` : ""
      } ${comp.alt ? `alt="${comp.alt}"` : ""} />`
    }

    // Handle container with children
    let childrenHTML = ""
    if (comp.children && comp.children.length > 0) {
      childrenHTML = comp.children.map((child) => renderComponentToHTML(child)).join("")
    }

    return `<${comp.type} style="${styleStr}" ${
      comp.href ? `href="${comp.href}"` : ""
    }>${comp.content || ""}${childrenHTML}</${comp.type}>`
  }

  const htmlOutput = components.map((comp) => renderComponentToHTML(comp)).join("")

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={() => setIsOpen(false)} className="modal-close">
          ×
        </button>

        <h2>Preview</h2>

        <div className="modal-actions">
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
            className="action-button export-html"
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
            className="action-button export-json"
          >
            Export JSON
          </button>
        </div>

        <div className="preview-area">
          <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
        </div>

        <div className="html-output">
          <h3>HTML Output</h3>
          <pre>{htmlOutput}</pre>
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
        return `${indentStr}<${comp.type}\n${indentStr}  style={${styleObj}}\n${indentStr}  ${
          comp.src ? `src="${comp.src}"` : ""
        }\n${indentStr}  ${comp.alt ? `alt="${comp.alt}"` : ""}\n${indentStr}/>`
      }

      // Handle container with children
      let childrenJSX = ""
      if (comp.children && comp.children.length > 0) {
        childrenJSX = comp.children.map((child) => renderComponentToJSX(child, indent + 1)).join("\n")
        return `${indentStr}<${comp.type} style={${styleObj}} ${comp.href ? `href="${comp.href}"` : ""}>\n${
          comp.content ? `${indentStr}  ${comp.content}\n` : ""
        }${childrenJSX}\n${indentStr}</${comp.type}>`
      }

      return `${indentStr}<${comp.type} style={${styleObj}} ${
        comp.href ? `href="${comp.href}"` : ""
      }>${comp.content || ""}</${comp.type}>`
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={() => setIsOpen(false)} className="modal-close">
          ×
        </button>

        <h2>Export React Code</h2>

        <div className="modal-actions">
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
            className="action-button export-react"
          >
            Download React Component
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(reactCode)
              alert("Code copied to clipboard!")
            }}
            className="action-button copy-code"
          >
            Copy to Clipboard
          </button>
        </div>

        <div className="code-preview">
          <pre>{reactCode}</pre>
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
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  useEffect(() => {
    // Check if device is mobile
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
        setRightSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="editor-container">
        <div className="editor-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
          <h1>SiteBuilder Editor</h1>
          <button className="right-sidebar-toggle" onClick={toggleRightSidebar}>
            {rightSidebarOpen ? "▶" : "◀"}
          </button>
        </div>

        <div className="editor-main">
          <div className={`editor-sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <h2>Components</h2>
            <ComponentCategoryList categories={componentCategories} />
          </div>

          <Canvas components={components} setComponents={setComponents} setSelectedElement={setSelectedElement} />

          <RightPanel
            selectedElement={selectedElement}
            setComponents={setComponents}
            components={components}
            rightSidebarOpen={rightSidebarOpen}
          />
        </div>

        <div className="editor-actions">
          <button onClick={() => setIsPreviewModalOpen(true)} className="action-button preview-button">
            Preview
          </button>

          <button onClick={() => setIsCodeExportModalOpen(true)} className="action-button export-button">
            Export Code
          </button>
        </div>
      </div>

      <PreviewModal components={components} isOpen={isPreviewModalOpen} setIsOpen={setIsPreviewModalOpen} />

      <CodeExportModal components={components} isOpen={isCodeExportModalOpen} setIsOpen={setIsCodeExportModalOpen} />
    </DndContext>
  )
}
