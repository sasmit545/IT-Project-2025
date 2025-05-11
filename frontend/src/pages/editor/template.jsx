"use client"

import { useState, useEffect } from "react"
import { DndContext, useDndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import {
    FaParagraph,
    FaSquare,
    FaBox,
    FaHeading,
    FaImage,
    FaListUl,
    FaLink
} from "react-icons/fa";
import "./editor.css"
import Navigation from "../../components/navigation";



// Components definition
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
        src: "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_1280.png",
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
        style: { color: "#6366f1", textDecoration: "underline" },
        href: "#",
        closing: 1,
    },
]

// Icons mapped by component id
const categoryIcons = {
    text: <FaParagraph className="h-5 w-5" />,           // better for text/paragraph
    button: <FaSquare className="h-5 w-5" />,             // simple block-like button
    container: <FaBox className="h-5 w-5" />,             // container/box metaphor
    heading: <FaHeading className="h-5 w-5" />,           // clear for headings/titles
    image: <FaImage className="h-5 w-5" />,               // image icon
    list: <FaListUl className="h-5 w-5" />,               // unordered list
    link: <FaLink className="h-5 w-5" />                  // link icon
};
const componentColors = {
    text: 'bg-gradient-to-r from-rose-100 via-rose-200 to-pink-200',
    heading: 'bg-gradient-to-r from-sky-100 via-sky-200 to-blue-200',
    button: 'bg-gradient-to-r from-emerald-100 via-green-200 to-lime-200',
    container: 'bg-gradient-to-r from-cyan-100 via-teal-100 to-sky-100',
    image: 'bg-gradient-to-r from-violet-100 via-purple-200 to-indigo-200',
    list: 'bg-gradient-to-r from-yellow-100 via-amber-200 to-orange-100',
    link: 'bg-gradient-to-r from-teal-100 via-cyan-200 to-blue-100',
};



// Categories
const componentCategories = [
    { id: "basic", label: "Basic Elements", components: ["text", "heading", "button"] },
    { id: "layout", label: "Layout", components: ["container"] },
    { id: "media", label: "Media", components: ["image"] },
    { id: "navigation", label: "Navigation", components: ["link", "list"] },
]




function DraggableComponent({ id, content, icon }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const { active } = useDndContext();

    const isDragging = active?.id === id;

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : {};

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
        p-4 
        ${componentColors[id]} 
        cursor-grab 
        mb-3 
        rounded-xl 
        shadow-sm 
        border border-violet-200 
        flex items-center gap-4 
        transition-all duration-200 ease-in-out 
        hover:shadow-lg 
        hover:scale-[1.02] 
        ${isDragging ? 'absolute z-10 w-48' : ''}
      `}
            style={style}
        >
            {icon && <span className="text-gray-600 text-2xl">{icon}</span>}
            <span className="text-sm font-medium text-gray-800">{content}</span>
        </div>
    );
}


// Expandable category list
function ComponentCategoryList({ categories }) {
    const [expandedCategories, setExpandedCategories] = useState(categories.map((cat) => cat.id))

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    return (
        <div className="space-y-3">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                >
                    <div
                        onClick={() => toggleCategory(category.id)}
                        className={`p-3 bg-gradient-to-r from-slate-50 to-slate-100 cursor-pointer flex justify-between items-center font-medium text-slate-700 hover:bg-violet-100 transition-colors `}
                    >
                        <div className="flex items-center space-x-2">
                            <span>{category.label}</span>
                        </div>
                        <span>
                            {expandedCategories.includes(category.id) ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                        </span>
                    </div>
                    {expandedCategories.includes(category.id) && (
                        <div className="p-2 bg-white ">
                            {category.components.map((compId) => {
                                const comp = componentsList.find((c) => c.id === compId)
                                return (

                                    comp && (
                                        <DraggableComponent
                                            key={comp.id}
                                            id={comp.id}
                                            content={comp.label}
                                            icon={categoryIcons[comp.id]}
                                        />
                                    )
                                )
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
    }

    return (
        <div
            ref={setNodeRef}
            className={`relative transition-all duration-200 ${isOver ? "bg-violet-50 border-violet-300" : "border-dashed border-gray-300"
                } border`}
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
                    className="mb-2.5"
                />
            )}

            {component.children &&
                component.children.map((childComp, childIndex) => (
                    <div key={childIndex} className="relative">
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
                            className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs opacity-80 hover:opacity-100"
                            aria-label="Delete component"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

            {component.isContainer && component.children.length === 0 && (
                <div className="text-center py-5 text-slate-500">Drop components here</div>
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
        return <img src={component.src || "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_1280.png"} alt={component.alt || "Image"} {...props} />
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
        <div className="w-3/5 flex flex-col">
            <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex gap-2 
      items-center shadow-sm">
                <button
                    onClick={handleUndo}
                    disabled={historyStack.length <= 1}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${historyStack.length <= 1
                        ? "opacity-50 cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-blue-300 hover:bg-blue-700 hover:text-white text-slate-800 shadow-sm border border-slate-200"
                        }`}
                >
                    Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={futureStack.length === 0}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${futureStack.length === 0
                        ? "opacity-50 cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-emerald-300 hover:bg-emerald-700 hover:text-white text-slate-900 shadow-sm border border-slate-200"
                        }`}
                >
                    Redo
                </button>
            </div>

            <div
                ref={setNodeRef}
                className={`min-h-[400px] border-2 border-dashed ${isOver ? "border-violet-400 bg-violet-100" : "border-slate-300 bg-slate-50"
                    } p-4 flex flex-col gap-3 overflow-auto flex-1 relative transition-colors duration-200`}
            >
                {components.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p className="text-lg">Drag elements here to start building</p>
                        <p className="text-sm mt-2">Select components from the left panel</p>
                    </div>
                ) : (
                    components.map((comp, index) => (
                        <div key={index} className="relative my-2 group">
                            <RenderComponent
                                component={comp}
                                componentPath={[index]}
                                components={components}
                                setComponents={setComponents}
                                setSelectedElement={setSelectedElement}
                            />
                            <button
                                onClick={() => handleDeleteComponent(index)}
                                className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                                aria-label="Delete component"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function RightPanel({ selectedElement, setComponents, components }) {
    const [element, setElement] = useState(selectedElement)

    useEffect(() => {
        setElement(selectedElement)
    }, [selectedElement])

    if (!selectedElement)
        return (
            <div className="w-1/5 p-4 border-l border-slate-200 bg-slate-50">
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Style Editor</h3>
                    <p className="text-slate-500 text-sm">Select an element to edit its properties</p>
                    <div className="mt-6 p-4 border border-dashed border-slate-300 rounded-lg">
                        <p className="text-slate-400 text-xs">
                            Click on any element in the canvas to customize its appearance and behavior
                        </p>
                    </div>
                </div>
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

    // Function to update multiple style properties at once
    const updateMultipleStyles = (styleObject) => {
        Object.entries(styleObject).forEach(([property, value]) => {
            updateStyle(property, value);
        });
    }

    return (
        <div className="w-1/5 p-4 border-l border-slate-200 bg-slate-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                <h3 className="text-lg font-medium text-slate-800 mb-2">Element Properties</h3>
                <div className="p-2 bg-slate-50 rounded-md border border-slate-200">
                    <label className="font-medium text-slate-700 block mb-1">
                        Type: <span className="font-normal text-slate-500">{element?.type}</span>
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Text Styles</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Text Color: </label>
                        <input
                            type="color"
                            onChange={(e) => updateStyle("color", e.target.value)}
                            value={element?.style?.color || "#000000"}
                            className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Font Size: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="8"
                                max="72"
                                onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />

                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseInt(element?.style?.fontSize) || 16}px
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Font Weight: </label>
                        <select
                            onChange={(e) => updateStyle("fontWeight", e.target.value)}
                            value={element?.style?.fontWeight || "normal"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="lighter">Lighter</option>
                            <option value="100">Thin (100)</option>
                            <option value="300">Light (300)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semibold (600)</option>
                            <option value="800">Extra Bold (800)</option>
                            <option value="900">Black (900)</option>
                        </select>
                    </div>

                    {/* NEW: Font Family */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Font Family: </label>
                        <select
                            onChange={(e) => updateStyle("fontFamily", e.target.value)}
                            value={element?.style?.fontFamily || "inherit"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="inherit">Default</option>
                            <option value="'Arial', sans-serif">Arial</option>
                            <option value="'Helvetica', sans-serif">Helvetica</option>
                            <option value="'Georgia', serif">Georgia</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                            <option value="'Courier New', monospace">Courier New</option>
                            <option value="'Verdana', sans-serif">Verdana</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                            <option value="'Open Sans', sans-serif">Open Sans</option>
                            <option value="'Montserrat', sans-serif">Montserrat</option>
                        </select>
                    </div>

                    {/* NEW: Text Transform */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Text Transform: </label>
                        <select
                            onChange={(e) => updateStyle("textTransform", e.target.value)}
                            value={element?.style?.textTransform || "none"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="none">None</option>
                            <option value="uppercase">UPPERCASE</option>
                            <option value="lowercase">lowercase</option>
                            <option value="capitalize">Capitalize</option>
                        </select>
                    </div>

                    {/* NEW: Line Height */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Line Height: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="100"
                                max="300"
                                step="10"
                                onChange={(e) => updateStyle("lineHeight", `${e.target.value}%`)}
                                value={Number.parseInt(element?.style?.lineHeight) || 150}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseInt(element?.style?.lineHeight) || 150}%
                            </span>
                        </div>
                    </div>

                    {/* NEW: Letter Spacing */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Letter Spacing: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="-3"
                                max="10"
                                step="0.5"
                                onChange={(e) => updateStyle("letterSpacing", `${e.target.value}px`)}
                                value={Number.parseFloat(element?.style?.letterSpacing) || 0}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseFloat(element?.style?.letterSpacing) || 0}px
                            </span>
                        </div>
                    </div>

                    {/* NEW: Text Decoration */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Text Decoration: </label>
                        <select
                            onChange={(e) => updateStyle("textDecoration", e.target.value)}
                            value={element?.style?.textDecoration || "none"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="none">None</option>
                            <option value="underline">Underline</option>
                            <option value="overline">Overline</option>
                            <option value="line-through">Strikethrough</option>
                        </select>
                    </div>

                    {/* NEW: Text Shadow */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Text Shadow: </label>
                        <select
                            onChange={(e) => updateStyle("textShadow", e.target.value)}
                            value={element?.style?.textShadow || "none"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="none">None</option>
                            <option value="1px 1px 2px rgba(0,0,0,0.3)">Light</option>
                            <option value="2px 2px 4px rgba(0,0,0,0.4)">Medium</option>
                            <option value="3px 3px 6px rgba(0,0,0,0.5)">Heavy</option>
                            <option value="0px 0px 8px rgba(0,0,0,0.5)">Glow</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Layout</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Text Align: </label>
                        <div className="grid grid-cols-3 gap-1">
                            <button
                                onClick={() => updateStyle("textAlign", "left")}
                                className={`p-2 border ${element?.style?.textAlign === "left"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Left
                            </button>
                            <button
                                onClick={() => updateStyle("textAlign", "center")}
                                className={`p-2 border ${element?.style?.textAlign === "center"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Center
                            </button>
                            <button
                                onClick={() => updateStyle("textAlign", "right")}
                                className={`p-2 border ${element?.style?.textAlign === "right"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Right
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Display Type:</label>
                        <div className="grid grid-cols-3 gap-1">
                            <button
                                onClick={() => updateStyle("display", "block")}
                                className={`p-2 border ${element?.style?.display === "block"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Block
                            </button>
                            <button
                                onClick={() => updateStyle("display", "inline")}
                                className={`p-2 border ${element?.style?.display === "inline"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Inline
                            </button>
                            <button
                                onClick={() => updateStyle("display", "flex")}
                                className={`p-2 border ${element?.style?.display === "flex"
                                    ? "bg-violet-100 border-violet-300 text-violet-700"
                                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                    } rounded text-sm font-medium transition-colors`}
                            >
                                Flex
                            </button>
                        </div>
                    </div>

                    {/* Show Flex direction when display is Flex */}
                    {element?.style?.display === "flex" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Flex Direction:</label>
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    onClick={() => updateStyle("flexDirection", "row")}
                                    className={`p-2 border ${element?.style?.flexDirection === "row" || !element?.style?.flexDirection
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Row
                                </button>
                                <button
                                    onClick={() => updateStyle("flexDirection", "column")}
                                    className={`p-2 border ${element?.style?.flexDirection === "column"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Column
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Show Justify Content options only when display is Flex */}
                    {element?.style?.display === "flex" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Justify Content:</label>
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    onClick={() => updateStyle("justifyContent", "flex-start")}
                                    className={`p-2 border ${element?.style?.justifyContent === "flex-start"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Start
                                </button>
                                <button
                                    onClick={() => updateStyle("justifyContent", "center")}
                                    className={`p-2 border ${element?.style?.justifyContent === "center"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Center
                                </button>
                                <button
                                    onClick={() => updateStyle("justifyContent", "flex-end")}
                                    className={`p-2 border ${element?.style?.justifyContent === "flex-end"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    End
                                </button>
                                <button
                                    onClick={() => updateStyle("justifyContent", "space-between")}
                                    className={`p-2 border ${element?.style?.justifyContent === "space-between"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Space Between
                                </button>
                            </div>
                        </div>
                    )}

                    {/* NEW: Align Items options when display is Flex */}
                    {element?.style?.display === "flex" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Align Items:</label>
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    onClick={() => updateStyle("alignItems", "flex-start")}
                                    className={`p-2 border ${element?.style?.alignItems === "flex-start"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Start
                                </button>
                                <button
                                    onClick={() => updateStyle("alignItems", "center")}
                                    className={`p-2 border ${element?.style?.alignItems === "center"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Center
                                </button>
                                <button
                                    onClick={() => updateStyle("alignItems", "flex-end")}
                                    className={`p-2 border ${element?.style?.alignItems === "flex-end"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    End
                                </button>
                                <button
                                    onClick={() => updateStyle("alignItems", "stretch")}
                                    className={`p-2 border ${element?.style?.alignItems === "stretch"
                                        ? "bg-violet-100 border-violet-300 text-violet-700"
                                        : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-violet-100"
                                        } rounded text-sm font-medium transition-colors`}
                                >
                                    Stretch
                                </button>
                            </div>
                        </div>
                    )}

                    {/* NEW: Gap for Flex containers */}
                    {element?.style?.display === "flex" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Gap: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    onChange={(e) => updateStyle("gap", `${e.target.value}px`)}
                                    value={Number.parseInt(element?.style?.gap) || 0}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.gap) || 0}px
                                </span>
                            </div>
                        </div>
                    )}

                    {/* NEW: Position */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Position: </label>
                        <select
                            onChange={(e) => updateStyle("position", e.target.value)}
                            value={element?.style?.position || "static"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="static">Static</option>
                            <option value="relative">Relative</option>
                            <option value="absolute">Absolute</option>
                            <option value="fixed">Fixed</option>
                            <option value="sticky">Sticky</option>
                        </select>
                    </div>

                    {/* Show positioning options when position is not static */}
                    {element?.style?.position && element?.style?.position !== "static" && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Top: </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("marginBottom", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.marginBottom) || 0}
                                        className="w-full p-1 border border-slate-300 rounded text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />




                                    <span className="ml-1 bg-violet-100 p-2 rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Left: </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        onChange={(e) => updateStyle("left", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.left) || 0}
                                        className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-2 rounded">px</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEW: Z-Index */}
                    {element?.style?.position && element?.style?.position !== "static" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Z-Index: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    onChange={(e) => updateStyle("zIndex", e.target.value)}
                                    value={Number.parseInt(element?.style?.zIndex) || 0}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.zIndex) || 0}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Box Styles</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Background: </label>
                        <input
                            type="color"
                            onChange={(e) => updateStyle("background", e.target.value)}
                            value={element?.style?.background || "#FFFFFF"}
                            className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
                        />
                    </div>

                    {/* NEW: Background Opacity */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Background Opacity: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                onChange={(e) => {
                                    const opacity = e.target.value / 100;
                                    let bgColor = element?.style?.background || "#FFFFFF";

                                    // Check if background is already in rgba format
                                    if (bgColor.startsWith('rgba')) {
                                        // Replace the opacity value in the rgba string
                                        bgColor = bgColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
                                            `rgba($1, $2, $3, ${opacity})`);
                                    }
                                    // Check if background is in hex format
                                    else if (bgColor.startsWith('#')) {
                                        // Convert hex to rgba
                                        const r = parseInt(bgColor.slice(1, 3), 16);
                                        const g = parseInt(bgColor.slice(3, 5), 16);
                                        const b = parseInt(bgColor.slice(5, 7), 16);
                                        bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                                    }

                                    updateStyle("background", bgColor);
                                }}
                                value={(element?.style?.background?.startsWith('rgba') ?
                                    parseFloat(element.style.background.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)[4]) * 100 :
                                    100)}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {element?.style?.background?.startsWith('rgba') ?
                                    Math.round(parseFloat(element.style.background.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)[4]) * 100) :
                                    100}%
                            </span>
                        </div>
                    </div>

                    {/* NEW: Background Image */}
                    {/* <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">Background Image URL: </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              onChange={(e) => updateStyle("backgroundImage", e.target.value ? `url(${e.target.value})` : 'none')}
              value={element?.style?.backgroundImage?.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') || ''}
              className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
            />
          </div> */}

                    {/* NEW: Background Position */}
                    {element?.style?.backgroundImage && element?.style?.backgroundImage !== 'none' && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Background Position: </label>
                            <select
                                onChange={(e) => updateStyle("backgroundPosition", e.target.value)}
                                value={element?.style?.backgroundPosition || "center"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="center">Center</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="top left">Top Left</option>
                                <option value="top right">Top Right</option>
                                <option value="bottom left">Bottom Left</option>
                                <option value="bottom right">Bottom Right</option>
                            </select>
                        </div>
                    )}

                    {/* NEW: Background Size */}
                    {element?.style?.backgroundImage && element?.style?.backgroundImage !== 'none' && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Background Size: </label>
                            <select
                                onChange={(e) => updateStyle("backgroundSize", e.target.value)}
                                value={element?.style?.backgroundSize || "cover"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                                <option value="100%">100%</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Padding: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="50"
                                onChange={(e) => updateStyle("padding", `${e.target.value}px`)}
                                value={Number.parseInt(element?.style?.padding) || 0}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseInt(element?.style?.padding) || 0}px
                            </span>
                        </div>
                    </div>

                    {/* NEW: Individual Padding Controls */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Padding (Individual): </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Top:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("paddingTop", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.paddingTop) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Right:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("paddingRight", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.paddingRight) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Bottom:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("paddingBottom", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.paddingBottom) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Left:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("paddingLeft", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.paddingLeft) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Margin: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="50"
                                onChange={(e) => updateStyle("margin", `${e.target.value}px`)}
                                value={Number.parseInt(element?.style?.margin) || 0}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseInt(element?.style?.margin) || 0}px
                            </span>
                        </div>
                    </div>

                    {/* NEW: Individual Margin Controls */}
                    <div>
                        <label className="block mb-1  font-medium text-slate-700">Margin (Individual): </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Top:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("marginTop", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.marginTop) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-red-500 text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Right:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("marginRight", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.marginRight) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Bottom:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("marginBottom", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.marginBottom) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-black text-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />


                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Left:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("marginLeft", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.marginLeft) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Border Radius: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="50"
                                onChange={(e) => updateStyle("borderRadius", `${e.target.value}px`)}
                                value={Number.parseInt(element?.style?.borderRadius) || 0}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Number.parseInt(element?.style?.borderRadius) || 0}px
                            </span>
                        </div>
                    </div>

                    {/* NEW: Individual Border Radius Controls */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Border Radius (Individual): </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Top Left:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("borderTopLeftRadius", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.borderTopLeftRadius) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Top Right:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("borderTopRightRadius", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.borderTopRightRadius) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Bottom Left:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("borderBottomLeftRadius", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.borderBottomLeftRadius) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-slate-600">Bottom Right:</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateStyle("borderBottomRightRadius", `${e.target.value}px`)}
                                        value={Number.parseInt(element?.style?.borderBottomRightRadius) || 0}
                                        className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                                        style={{
                                            backgroundColor: "#f5f3ff",
                                        }}
                                    />
                                    <span className="ml-1 bg-violet-100 p-1 text-xs rounded">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Border: </label>
                        <select
                            onChange={(e) => updateStyle("border", e.target.value)}
                            value={element?.style?.border || "none"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="none">None</option>
                            <option value="1px solid black">Thin</option>
                            <option value="2px solid black">Medium</option>
                            <option value="3px solid black">Thick</option>
                            <option value="1px dashed #ccc">Dashed</option>
                            <option value="1px dotted #ccc">Dotted</option>
                        </select>
                    </div>

                    {/* NEW: Border Color */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Border Color: </label>
                        <input
                            type="color"
                            onChange={(e) => {
                                // If there's already a border, replace its color
                                if (element?.style?.border && element?.style?.border !== "none") {
                                    const borderParts = element.style.border.split(' ');
                                    if (borderParts.length >= 3) {
                                        borderParts[2] = e.target.value;
                                        updateStyle("border", borderParts.join(' '));
                                    } else {
                                        // If border format is unexpected, just set new border with the color
                                        updateStyle("border", `1px solid ${e.target.value}`);
                                    }
                                } else {
                                    // No existing border, create a new one
                                    updateStyle("border", `1px solid ${e.target.value}`);
                                }
                            }}
                            value={element?.style?.border?.split(' ')[2] || "#000000"}
                            className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
                        />
                    </div>

                    {/* NEW: Box Shadow */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Box Shadow: </label>
                        <select
                            onChange={(e) => updateStyle("boxShadow", e.target.value)}
                            value={element?.style?.boxShadow || "none"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="none">None</option>
                            <option value="0 1px 3px rgba(0,0,0,0.12)">Light</option>
                            <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                            <option value="0 10px 15px -3px rgba(0,0,0,0.1)">Large</option>
                            <option value="0 20px 25px -5px rgba(0,0,0,0.1)">Extra Large</option>
                            <option value="0 0 15px rgba(0,0,0,0.1)">Soft Glow</option>
                            <option value="rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(0, 0, 0, 0.1) 0px 0px 0px 3px">Outline</option>
                            <option value="rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px">Layered</option>
                            <option value="rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px">Stacked</option>
                        </select>
                    </div>

                    {/* NEW: Opacity */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Opacity: </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                onChange={(e) => updateStyle("opacity", e.target.value / 100)}
                                value={(element?.style?.opacity || 1) * 100}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                {Math.round((element?.style?.opacity || 1) * 100)}%
                            </span>
                        </div>
                    </div>

                    {/* NEW: Overflow */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">Overflow: </label>
                        <select
                            onChange={(e) => updateStyle("overflow", e.target.value)}
                            value={element?.style?.overflow || "visible"}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                        >
                            <option value="visible">Visible</option>
                            <option value="hidden">Hidden</option>
                            <option value="scroll">Scroll</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                </div>
            </div>

            {element?.type === "a" && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                    <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Link Settings</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">URL: </label>
                            <input
                                type="text"
                                onChange={(e) => updateAttribute("href", e.target.value)}
                                value={element?.href || "#"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Opens in: </label>
                            <select
                                onChange={(e) => updateAttribute("target", e.target.value)}
                                value={element?.target || "_self"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="_self">Same Window</option>
                                <option value="_blank">New Window</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {element?.type === "img" && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                    <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Image Settings</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Image URL: </label>
                            <input
                                type="text"
                                onChange={(e) => updateAttribute("src", e.target.value)}
                                value={element?.src || ""}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Alt Text: </label>
                            <input
                                type="text"
                                onChange={(e) => updateAttribute("alt", e.target.value)}
                                value={element?.alt || ""}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            />
                        </div>

                        {/* NEW: Object Fit */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Object Fit: </label>
                            <select
                                onChange={(e) => updateStyle("objectFit", e.target.value)}
                                value={element?.style?.objectFit || "fill"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="fill">Fill</option>
                                <option value="contain">Contain</option>
                                <option value="cover">Cover</option>
                                <option value="none">None</option>
                                <option value="scale-down">Scale Down</option>
                            </select>
                        </div>

                        {/* NEW: Object Position */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Object Position: </label>
                            <select
                                onChange={(e) => updateStyle("objectPosition", e.target.value)}
                                value={element?.style?.objectPosition || "center"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="center">Center</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="top left">Top Left</option>
                                <option value="top right">Top Right</option>
                                <option value="bottom left">Bottom Left</option>
                                <option value="bottom right">Bottom Right</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {element?.isContainer && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                    <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Container Settings</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Width: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    onChange={(e) => updateStyle("width", `${e.target.value}%`)}
                                    value={Number.parseInt(element?.style?.width) || 100}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.width) || 100}%
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Min Height: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="50"
                                    max="500"
                                    onChange={(e) => updateStyle("minHeight", `${e.target.value}px`)}
                                    value={Number.parseInt(element?.style?.minHeight) || 100}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.minHeight) || 100}px
                                </span>
                            </div>
                        </div>

                        {/* NEW: Max Width */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Max Width: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1200"
                                    step="50"
                                    onChange={(e) => updateStyle("maxWidth", e.target.value === "0" ? "none" : `${e.target.value}px`)}
                                    value={element?.style?.maxWidth === "none" ? 0 : Number.parseInt(element?.style?.maxWidth) || 0}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[50px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {element?.style?.maxWidth === "none" ? "None" : `${Number.parseInt(element?.style?.maxWidth) || 0}px`}
                                </span>
                            </div>
                        </div>

                        {/* NEW: Max Height */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Max Height: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="50"
                                    onChange={(e) => updateStyle("maxHeight", e.target.value === "0" ? "none" : `${e.target.value}px`)}
                                    value={element?.style?.maxHeight === "none" ? 0 : Number.parseInt(element?.style?.maxHeight) || 0}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[50px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {element?.style?.maxHeight === "none" ? "None" : `${Number.parseInt(element?.style?.maxHeight) || 0}px`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {element?.type === "button" && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
                    <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">Button Settings</h4>
                    <div className="space-y-4">
                        {/* Button Text Size */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Text Size: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                                    value={Number.parseInt(element?.style?.fontSize) || 16}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.fontSize) || 16}px
                                </span>
                            </div>
                        </div>

                        {/* Button Padding */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Padding: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="4"
                                    max="20"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        updateStyle("padding", `${Math.floor(value / 2)}px ${value}px`);
                                    }}
                                    value={Number.parseInt((element?.style?.padding || "10px 20px").split(" ")[1]) || 20}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[60px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt((element?.style?.padding || "10px 20px").split(" ")[1]) || 20}px
                                </span>
                            </div>
                        </div>

                        {/* Border Radius */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Border Radius: </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="24"
                                    onChange={(e) => updateStyle("borderRadius", `${e.target.value}px`)}
                                    value={Number.parseInt(element?.style?.borderRadius) || 4}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                                <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                                    {Number.parseInt(element?.style?.borderRadius) || 4}px
                                </span>
                            </div>
                        </div>

                        {/* Cursor Type */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">Cursor: </label>
                            <select
                                onChange={(e) => updateStyle("cursor", e.target.value)}
                                value={element?.style?.cursor || "pointer"}
                                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                            >
                                <option value="pointer">Pointer</option>
                                <option value="default">Default</option>
                                <option value="not-allowed">Not Allowed</option>
                            </select>
                        </div>




                    </div>
                </div>
            )}


            <div className="h-16">

            </div>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-4/5 h-4/5 flex flex-col relative shadow-2xl">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-base hover:bg-rose-600 transition-colors"
                    aria-label="Close preview"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold mb-5 text-slate-800">Preview</h2>

                <div className="flex gap-5 mb-5">
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
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none rounded-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-md font-medium"
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
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-none rounded-lg cursor-pointer hover:from-violet-600 hover:to-violet-700 transition-colors shadow-md font-medium"
                    >
                        Export JSON
                    </button>
                </div>

                <div className="flex-1 border border-slate-200 rounded-lg p-5 overflow-auto bg-white shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-lg max-h-[200px] overflow-auto border border-slate-200">
                    <h3 className="text-lg font-medium mb-2.5 text-slate-800">HTML Output</h3>
                    <pre className="whitespace-pre-wrap text-xs bg-violet-100 p-3 rounded border border-slate-200 overflow-x-auto">
                        {htmlOutput}
                    </pre>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-4/5 h-4/5 flex flex-col relative shadow-2xl">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-base hover:bg-rose-600 transition-colors"
                    aria-label="Close code export"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold mb-5 text-slate-800">Export React Code</h2>

                <div className="flex gap-5 mb-5">
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
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none rounded-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-md font-medium"
                    >
                        Download React Component
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(reactCode)
                            alert("Code copied to clipboard!")
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-none rounded-lg cursor-pointer hover:from-violet-600 hover:to-violet-700 transition-colors shadow-md font-medium"
                    >
                        Copy to Clipboard
                    </button>
                </div>

                <div className="flex-1 border border-slate-200 rounded-lg p-5 overflow-auto bg-slate-50 font-mono shadow-inner">
                    <pre className="whitespace-pre-wrap text-sm">{reactCode}</pre>
                </div>
            </div>
        </div>
    )
}

export default function PageBuilder({ onLogout, type }) {

    const saasTemplate = [
        {
            id: "main-container",
            label: "Main Container",
            type: "div",
            content: "",
            style: {
                padding: "0",
                margin: "0",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                color: "#1a202c",
                backgroundColor: "#f7fafc",
                overflowX: "hidden",
            },
            isContainer: true,
            closing: 1,
            children: [
                // Hero Section with Gradient Background
                {
                    id: "hero-container",
                    label: "Hero Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "80px 20px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "hero-heading",
                            label: "Hero Heading",
                            type: "h2",
                            content: "Transform Your Ideas Into Reality",
                            style: {
                                fontSize: "48px",
                                fontWeight: "800",
                                marginBottom: "24px",
                                letterSpacing: "-0.025em",
                                lineHeight: "1.2",
                                maxWidth: "800px",
                                margin: "0 auto 20px",
                                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-subheading",
                            label: "Text",
                            type: "div",
                            content: "The most powerful visual builder for creating stunning web experiences — no coding required.",
                            style: {
                                fontSize: "20px",
                                fontWeight: "400",
                                maxWidth: "600px",
                                margin: "0 auto 40px",
                                lineHeight: "1.6",
                                opacity: "0.9",
                            },
                            closing: 1,
                        },
                        {
                            id: "cta-buttons-container",
                            label: "CTA Container",
                            type: "div",
                            content: "",
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                gap: "16px",
                                flexWrap: "wrap",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "primary-button",
                                    label: "Button",
                                    type: "button",
                                    content: "Get Started Free",
                                    style: {
                                        backgroundColor: "#ffffff",
                                        color: "#5a67d8",
                                        padding: "16px 32px",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.2s ease",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "secondary-button",
                                    label: "Button",
                                    type: "button",
                                    content: "Watch Demo",
                                    style: {
                                        backgroundColor: "transparent",
                                        color: "white",
                                        padding: "15px 32px",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        borderRadius: "8px",
                                        border: "2px solid white",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    },
                                    closing: 1,
                                },
                            ],
                        },
                    ],
                },

                // Features Section with Cards
                {
                    id: "features-section",
                    label: "Features Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "100px 20px",
                        backgroundColor: "#ffffff",
                        textAlign: "center",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "features-heading",
                            label: "Heading",
                            type: "h2",
                            content: "Powerful Features",
                            style: {
                                fontSize: "36px",
                                fontWeight: "700",
                                marginBottom: "20px",
                                color: "#2d3748",
                            },
                            closing: 1,
                        },
                        {
                            id: "features-description",
                            label: "Text",
                            type: "div",
                            content: "Everything you need to create beautiful, high-converting websites",
                            style: {
                                fontSize: "20px",
                                color: "#4a5568",
                                maxWidth: "700px",
                                margin: "0 auto 60px",
                                lineHeight: "1.6",
                            },
                            closing: 1,
                        },
                        {
                            id: "features-grid",
                            label: "Features Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "30px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Feature Card 1
                                {
                                    id: "feature-card-1",
                                    label: "Feature Card 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "40px 25px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "feature-icon-1",
                                            label: "Text",
                                            content: "🔄",
                                            type: "div",
                                            style: {
                                                fontSize: "48px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-title-1",
                                            label: "Heading",
                                            type: "h2",
                                            content: "Intuitive Drag & Drop",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "12px",
                                                color: "#2d3748",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-description-1",
                                            label: "Text",
                                            type: "div",
                                            content: "Simply drag and drop elements to create professional designs without writing a single line of code.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#4a5568",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Feature Card 2
                                {
                                    id: "feature-card-2",
                                    label: "Feature Card 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "40px 25px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "feature-icon-2",
                                            label: "Text",
                                            content: "🎨",
                                            type: "div",
                                            style: {
                                                fontSize: "48px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-title-2",
                                            label: "Heading",
                                            type: "h2",
                                            content: "Unlimited Customization",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "12px",
                                                color: "#2d3748",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-description-2",
                                            label: "Text",
                                            type: "div",
                                            content: "Personalize every aspect of your design with our powerful style editor and extensive component library.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#4a5568",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Feature Card 3
                                {
                                    id: "feature-card-3",
                                    label: "Feature Card 3",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "40px 25px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "feature-icon-3",
                                            label: "Text",
                                            content: "📤",
                                            type: "div",
                                            style: {
                                                fontSize: "48px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-title-3",
                                            label: "Heading",
                                            type: "h2",
                                            content: "Instant Code Export",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "12px",
                                                color: "#2d3748",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "feature-description-3",
                                            label: "Text",
                                            type: "div",
                                            content: "Export clean, production-ready code with a single click whenever you're ready to deploy.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#4a5568",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // Showcase Section with Image
                {
                    id: "showcase-section",
                    label: "Showcase Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "100px 20px",
                        background: "linear-gradient(to right, #f7fafc 0%, #edf2f7 100%)",
                        overflow: "hidden",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "showcase-grid",
                            label: "Showcase Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "60px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                                alignItems: "center",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Showcase Content
                                {
                                    id: "showcase-content",
                                    label: "Showcase Content",
                                    type: "div",
                                    content: "",
                                    style: {
                                        padding: "20px",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "showcase-heading",
                                            label: "Heading",
                                            type: "h2",
                                            content: "Design Like a Professional",
                                            style: {
                                                fontSize: "36px",
                                                fontWeight: "700",
                                                marginBottom: "20px",
                                                color: "#2d3748",
                                                lineHeight: "1.2",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "showcase-description",
                                            label: "Text",
                                            type: "div",
                                            content: "Our intuitive platform empowers everyone to create stunning, responsive websites that look professional on any device.",
                                            style: {
                                                fontSize: "18px",
                                                color: "#4a5568",
                                                marginBottom: "30px",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "showcase-list",
                                            label: "List",
                                            content: "<li>🚀 Launch websites in minutes, not days</li><li>💡 Access 100+ pre-designed templates</li><li>📱 Fully responsive on all devices</li><li>🔒 Enterprise-grade security & compliance</li>",
                                            type: "ul",
                                            style: {
                                                fontSize: "17px",
                                                color: "#4a5568",
                                                paddingLeft: "5px",
                                                listStyleType: "none",
                                                lineHeight: "2",
                                                marginBottom: "30px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "showcase-button",
                                            label: "Button",
                                            type: "button",
                                            content: "Start Creating",
                                            style: {
                                                backgroundColor: "#5a67d8",
                                                color: "white",
                                                padding: "16px 32px",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 4px 6px rgba(90, 103, 216, 0.3)",
                                                transition: "all 0.2s ease",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Showcase Image
                                {
                                    id: "showcase-image-container",
                                    label: "Showcase Image Container",
                                    type: "div",
                                    content: "",
                                    style: {
                                        position: "relative",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "showcase-visual",
                                            label: "Container",
                                            type: "div",
                                            content: "",
                                            style: {
                                                width: "100%",
                                                borderRadius: "12px",
                                                backgroundColor: "#e2e8f0",
                                                height: "320px",
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                position: "relative",
                                                overflow: "hidden",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "showcase-visual-pattern",
                                                    label: "Text",
                                                    type: "div",
                                                    content: "",
                                                    style: {
                                                        position: "absolute",
                                                        top: "0",
                                                        left: "0",
                                                        right: "0",
                                                        bottom: "0",
                                                        background: "linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%)",
                                                        opacity: "0.1",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "showcase-visual-text",
                                                    label: "Text",
                                                    type: "div",
                                                    content: "FlowBuilder",
                                                    style: {
                                                        fontSize: "32px",
                                                        fontWeight: "700",
                                                        color: "#4a5568",
                                                        zIndex: "1",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // Testimonials Section
                {
                    id: "testimonials-section",
                    label: "Testimonials Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "100px 20px",
                        backgroundColor: "#ffffff",
                        textAlign: "center",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "testimonials-heading",
                            label: "Heading",
                            type: "h2",
                            content: "What Our Users Say",
                            style: {
                                fontSize: "36px",
                                fontWeight: "700",
                                marginBottom: "20px",
                                color: "#2d3748",
                            },
                            closing: 1,
                        },
                        {
                            id: "testimonials-grid",
                            label: "Testimonials Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "30px",
                                maxWidth: "1200px",
                                margin: "40px auto 0",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Testimonial 1
                                {
                                    id: "testimonial-1",
                                    label: "Testimonial 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "30px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "quote-1",
                                            label: "Text",
                                            type: "div",
                                            content: "This platform has completely transformed our design workflow. What used to take days now takes hours. The interface is intuitive and the results are stunning.",
                                            style: {
                                                fontSize: "17px",
                                                color: "#4a5568",
                                                marginBottom: "20px",
                                                lineHeight: "1.7",
                                                fontStyle: "italic",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "testimonial-author-1",
                                            label: "Text",
                                            type: "div",
                                            content: "— Sarah Johnson, Marketing Director",
                                            style: {
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#2d3748",
                                                marginTop: "auto",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Testimonial 2
                                {
                                    id: "testimonial-2",
                                    label: "Testimonial 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "30px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "quote-2",
                                            label: "Text",
                                            type: "div",
                                            content: "As someone with no coding experience, I was able to create a professional website for my business in just one afternoon. The templates are beautiful and easy to customize.",
                                            style: {
                                                fontSize: "17px",
                                                color: "#4a5568",
                                                marginBottom: "20px",
                                                lineHeight: "1.7",
                                                fontStyle: "italic",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "testimonial-author-2",
                                            label: "Text",
                                            type: "div",
                                            content: "— Michael Torres, Small Business Owner",
                                            style: {
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#2d3748",
                                                marginTop: "auto",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Testimonial 3
                                {
                                    id: "testimonial-3",
                                    label: "Testimonial 3",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "30px",
                                        textAlign: "left",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "quote-3",
                                            label: "Text",
                                            type: "div",
                                            content: "The export functionality is incredible. We design in the visual editor then export clean code that our developers can easily integrate with our existing systems.",
                                            style: {
                                                fontSize: "17px",
                                                color: "#4a5568",
                                                marginBottom: "20px",
                                                lineHeight: "1.7",
                                                fontStyle: "italic",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "testimonial-author-3",
                                            label: "Text",
                                            type: "div",
                                            content: "— Lisa Chen, Product Manager",
                                            style: {
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#2d3748",
                                                marginTop: "auto",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // CTA Section
                {
                    id: "cta-section",
                    label: "CTA Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "80px 20px",
                        background: "linear-gradient(135deg, #4c51bf 0%, #6b46c1 100%)",
                        color: "white",
                        textAlign: "center",
                        borderRadius: "0",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "cta-heading",
                            label: "Heading",
                            type: "h2",
                            content: "Ready to Transform Your Design Process?",
                            style: {
                                fontSize: "36px",
                                fontWeight: "700",
                                marginBottom: "24px",
                                maxWidth: "800px",
                                margin: "0 auto 20px",
                            },
                            closing: 1,
                        },
                        {
                            id: "cta-text",
                            label: "Text",
                            type: "div",
                            content: "Join thousands of designers, marketers, and entrepreneurs who are creating beautiful websites with our platform.",
                            style: {
                                fontSize: "20px",
                                maxWidth: "600px",
                                margin: "0 auto 40px",
                                opacity: "0.9",
                                lineHeight: "1.6",
                            },
                            closing: 1,
                        },
                        {
                            id: "cta-button",
                            label: "Button",
                            type: "button",
                            content: "Start Your Free Trial",
                            style: {
                                backgroundColor: "white",
                                color: "#5a67d8",
                                padding: "18px 36px",
                                fontSize: "18px",
                                fontWeight: "600",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.2s ease",
                            },
                            closing: 1,
                        },
                        {
                            id: "no-credit-card",
                            label: "Text",
                            type: "div",
                            content: "No credit card required. 14-day free trial.",
                            style: {
                                fontSize: "16px",
                                marginTop: "20px",
                                opacity: "0.8",
                            },
                            closing: 1,
                        },
                    ],
                },

                // Footer
                {
                    id: "footer",
                    label: "Footer Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "60px 20px 40px",
                        backgroundColor: "#1a202c",
                        color: "white",
                        textAlign: "center",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "footer-logo",
                            label: "Text",
                            type: "div",
                            content: "FlowBuilder",
                            style: {
                                fontSize: "28px",
                                fontWeight: "700",
                                marginBottom: "30px",
                                color: "white",
                            },
                            closing: 1,
                        },
                        {
                            id: "footer-links",
                            label: "Footer Links",
                            type: "div",
                            content: "",
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: "20px",
                                marginBottom: "30px",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "link-1",
                                    label: "Link",
                                    content: "Features",
                                    type: "a",
                                    style: {
                                        color: "#cbd5e0",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "link-2",
                                    label: "Link",
                                    content: "Templates",
                                    type: "a",
                                    style: {
                                        color: "#cbd5e0",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "link-3",
                                    label: "Link",
                                    content: "Pricing",
                                    type: "a",
                                    style: {
                                        color: "#cbd5e0",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "link-4",
                                    label: "Link",
                                    content: "Blog",
                                    type: "a",
                                    style: {
                                        color: "#cbd5e0",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "link-5",
                                    label: "Link",
                                    content: "Contact",
                                    type: "a",
                                    style: {
                                        color: "#cbd5e0",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                            ],
                        },
                        {
                            id: "footer-copyright",
                            label: "Text",
                            type: "div",
                            content: "© 2025 FlowBuilder. All rights reserved.",
                            style: {
                                fontSize: "14px",
                                color: "#a0aec0",
                                marginTop: "20px",
                            },
                            closing: 1,
                        },
                    ],
                },
            ],
        },
    ]
    const ecommerceTemplate = [
        {
            id: "main-container",
            label: "Main Container",
            type: "div",
            content: "",
            style: {
                padding: "0",
                margin: "0",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                color: "#1a202c",
                backgroundColor: "#f7fafc",
                overflowX: "hidden",
            },
            isContainer: true,
            closing: 1,
            children: [
                // Navigation Bar
                {
                    id: "navbar",
                    label: "Navigation Bar",
                    type: "div",
                    content: "",
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 30px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                        position: "sticky",
                        top: "0",
                        zIndex: "100",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "brand-logo",
                            label: "Brand Logo",
                            type: "div",
                            content: "LUXEMART",
                            style: {
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#2d3748",
                                letterSpacing: "1px",
                            },
                            closing: 1,
                        },
                        {
                            id: "nav-links",
                            label: "Nav Links",
                            type: "div",
                            content: "",
                            style: {
                                display: "flex",
                                gap: "30px",
                                alignItems: "center",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "nav-link-1",
                                    label: "Link",
                                    content: "Shop",
                                    type: "a",
                                    style: {
                                        color: "#4a5568",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "nav-link-2",
                                    label: "Link",
                                    content: "Collections",
                                    type: "a",
                                    style: {
                                        color: "#4a5568",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "nav-link-3",
                                    label: "Link",
                                    content: "Sale",
                                    type: "a",
                                    style: {
                                        color: "#e53e3e",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                    },
                                    href: "#",
                                    closing: 1,
                                },
                                {
                                    id: "search-icon",
                                    label: "Text",
                                    content: "🔍",
                                    type: "div",
                                    style: {
                                        fontSize: "20px",
                                        cursor: "pointer",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "cart-icon",
                                    label: "Text",
                                    content: "🛒",
                                    type: "div",
                                    style: {
                                        fontSize: "20px",
                                        position: "relative",
                                        cursor: "pointer",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "account-icon",
                                    label: "Text",
                                    content: "👤",
                                    type: "div",
                                    style: {
                                        fontSize: "20px",
                                        cursor: "pointer",
                                    },
                                    closing: 1,
                                },
                            ],
                        },
                    ],
                },

                // Hero Banner
                {
                    id: "hero-banner",
                    label: "Hero Banner",
                    type: "div",
                    content: "",
                    style: {
                        background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
                        color: "white",
                        padding: "80px 30px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "hero-pattern",
                            label: "Hero Pattern",
                            type: "div",
                            content: "",
                            style: {
                                position: "absolute",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "0",
                                background: "radial-gradient(circle, transparent 20%, #2d3748 80%)",
                                backgroundSize: "20px 20px",
                                opacity: "0.1",
                            },
                            closing: 1,
                        },
                        {
                            id: "sale-badge",
                            label: "Sale Badge",
                            type: "div",
                            content: "SUMMER SALE",
                            style: {
                                backgroundColor: "#e53e3e",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "600",
                                display: "inline-block",
                                marginBottom: "24px",
                                letterSpacing: "1px",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-heading",
                            label: "Hero Heading",
                            type: "h2",
                            content: "Elevate Your Style",
                            style: {
                                fontSize: "48px",
                                fontWeight: "800",
                                marginBottom: "16px",
                                letterSpacing: "1px",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-subheading",
                            label: "Text",
                            type: "div",
                            content: "Up to 50% off on premium collections",
                            style: {
                                fontSize: "20px",
                                maxWidth: "600px",
                                margin: "0 auto 30px",
                                opacity: "0.9",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-cta",
                            label: "Button",
                            type: "button",
                            content: "Shop Now",
                            style: {
                                backgroundColor: "white",
                                color: "#2d3748",
                                padding: "15px 32px",
                                fontSize: "16px",
                                fontWeight: "600",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.2s ease",
                            },
                            closing: 1,
                        },
                    ],
                },

                // Featured Categories
                {
                    id: "categories-section",
                    label: "Categories Section",
                    type: "div",
                    content: "",
                    style: {
                        padding: "80px 30px",
                        backgroundColor: "#ffffff",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "categories-heading",
                            label: "Heading",
                            type: "h2",
                            content: "Shop By Category",
                            style: {
                                fontSize: "32px",
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: "40px",
                                color: "#2d3748",
                            },
                            closing: 1,
                        },
                        {
                            id: "categories-grid",
                            label: "Categories Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "24px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Category Card 1
                                {
                                    id: "category-1",
                                    label: "Category Card 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        height: "220px",
                                        borderRadius: "12px",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        backgroundColor: "#edf2f7",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "category-1-gradient",
                                            label: "Category Gradient",
                                            type: "div",
                                            content: "",
                                            style: {
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                right: "0",
                                                bottom: "0",
                                                background: "linear-gradient(rgba(45, 55, 72, 0.2) 0%, rgba(45, 55, 72, 0.6) 100%)",
                                                zIndex: "1",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-1-icon",
                                            label: "Text",
                                            content: "👕",
                                            type: "div",
                                            style: {
                                                fontSize: "40px",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -70%)",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-1-title",
                                            label: "Text",
                                            content: "Men's Fashion",
                                            type: "div",
                                            style: {
                                                position: "absolute",
                                                bottom: "20px",
                                                left: "0",
                                                right: "0",
                                                textAlign: "center",
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Category Card 2
                                {
                                    id: "category-2",
                                    label: "Category Card 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        height: "220px",
                                        borderRadius: "12px",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        backgroundColor: "#edf2f7",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "category-2-gradient",
                                            label: "Category Gradient",
                                            type: "div",
                                            content: "",
                                            style: {
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                right: "0",
                                                bottom: "0",
                                                background: "linear-gradient(rgba(45, 55, 72, 0.2) 0%, rgba(45, 55, 72, 0.6) 100%)",
                                                zIndex: "1",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-2-icon",
                                            label: "Text",
                                            content: "👗",
                                            type: "div",
                                            style: {
                                                fontSize: "40px",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -70%)",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-2-title",
                                            label: "Text",
                                            content: "Women's Collection",
                                            type: "div",
                                            style: {
                                                position: "absolute",
                                                bottom: "20px",
                                                left: "0",
                                                right: "0",
                                                textAlign: "center",
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Category Card 3
                                {
                                    id: "category-3",
                                    label: "Category Card 3",
                                    type: "div",
                                    content: "",
                                    style: {
                                        height: "220px",
                                        borderRadius: "12px",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        backgroundColor: "#edf2f7",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "category-3-gradient",
                                            label: "Category Gradient",
                                            type: "div",
                                            content: "",
                                            style: {
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                right: "0",
                                                bottom: "0",
                                                background: "linear-gradient(rgba(45, 55, 72, 0.2) 0%, rgba(45, 55, 72, 0.6) 100%)",
                                                zIndex: "1",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-3-icon",
                                            label: "Text",
                                            content: "👟",
                                            type: "div",
                                            style: {
                                                fontSize: "40px",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -70%)",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-3-title",
                                            label: "Text",
                                            content: "Footwear",
                                            type: "div",
                                            style: {
                                                position: "absolute",
                                                bottom: "20px",
                                                left: "0",
                                                right: "0",
                                                textAlign: "center",
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Category Card 4
                                {
                                    id: "category-4",
                                    label: "Category Card 4",
                                    type: "div",
                                    content: "",
                                    style: {
                                        height: "220px",
                                        borderRadius: "12px",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        backgroundColor: "#edf2f7",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.3s ease",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "category-4-gradient",
                                            label: "Category Gradient",
                                            type: "div",
                                            content: "",
                                            style: {
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                right: "0",
                                                bottom: "0",
                                                background: "linear-gradient(rgba(45, 55, 72, 0.2) 0%, rgba(45, 55, 72, 0.6) 100%)",
                                                zIndex: "1",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-4-icon",
                                            label: "Text",
                                            content: "💎",
                                            type: "div",
                                            style: {
                                                fontSize: "40px",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -70%)",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "category-4-title",
                                            label: "Text",
                                            content: "Accessories",
                                            type: "div",
                                            style: {
                                                position: "absolute",
                                                bottom: "20px",
                                                left: "0",
                                                right: "0",
                                                textAlign: "center",
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                zIndex: "2",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // Best Sellers Section
                {
                    id: "best-sellers-section",
                    label: "Best Sellers Section",
                    type: "div",
                    content: "",
                    style: {
                        padding: "60px 30px",
                        backgroundColor: "#f7fafc",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "best-sellers-heading",
                            label: "Heading",
                            type: "h2",
                            content: "Best Sellers",
                            style: {
                                fontSize: "32px",
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: "40px",
                                color: "#2d3748",
                            },
                            closing: 1,
                        },
                        {
                            id: "products-grid",
                            label: "Products Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                gap: "30px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Product Card 1
                                {
                                    id: "product-1",
                                    label: "Product Card 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#ffffff",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "pointer",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "product-1-image",
                                            label: "Product Image Placeholder",
                                            type: "div",
                                            content: "",
                                            style: {
                                                height: "200px",
                                                backgroundColor: "#e2e8f0",
                                                position: "relative",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "product-1-icon",
                                                    label: "Text",
                                                    content: "👔",
                                                    type: "div",
                                                    style: {
                                                        fontSize: "48px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-1-tag",
                                                    label: "Text",
                                                    content: "NEW",
                                                    type: "div",
                                                    style: {
                                                        position: "absolute",
                                                        top: "12px",
                                                        right: "12px",
                                                        backgroundColor: "#4299e1",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        padding: "5px 10px",
                                                        borderRadius: "4px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-1-wishlist",
                                                    label: "Text",
                                                    content: "❤️",
                                                    type: "div",
                                                    style: {
                                                        position: "absolute",
                                                        top: "12px",
                                                        left: "12px",
                                                        fontSize: "18px",
                                                        cursor: "pointer",
                                                        opacity: "0.7",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                        {
                                            id: "product-1-details",
                                            label: "Product Details",
                                            type: "div",
                                            content: "",
                                            style: {
                                                padding: "16px",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "product-1-title",
                                                    label: "Heading",
                                                    type: "h2",
                                                    content: "Premium Cotton Shirt",
                                                    style: {
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        marginBottom: "8px",
                                                        color: "#2d3748",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-1-category",
                                                    label: "Text",
                                                    type: "div",
                                                    content: "Men's Apparel",
                                                    style: {
                                                        fontSize: "14px",
                                                        color: "#718096",
                                                        marginBottom: "8px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-1-price-row",
                                                    label: "Price Row",
                                                    type: "div",
                                                    content: "",
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        marginTop: "8px",
                                                    },
                                                    isContainer: true,
                                                    closing: 1,
                                                    children: [
                                                        {
                                                            id: "product-1-price",
                                                            label: "Text",
                                                            type: "div",
                                                            content: "$49.99",
                                                            style: {
                                                                fontWeight: "700",
                                                                fontSize: "18px",
                                                                color: "#2d3748",
                                                            },
                                                            closing: 1,
                                                        },
                                                        {
                                                            id: "product-1-rating",
                                                            label: "Text",
                                                            type: "div",
                                                            content: "★★★★☆",
                                                            style: {
                                                                color: "#ecc94b",
                                                                fontSize: "14px",
                                                            },
                                                            closing: 1,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },

                                // Product Card 2
                                {
                                    id: "product-2",
                                    label: "Product Card 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#ffffff",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "pointer",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "product-2-image",
                                            label: "Product Image Placeholder",
                                            type: "div",
                                            content: "",
                                            style: {
                                                height: "200px",
                                                backgroundColor: "#e2e8f0",
                                                position: "relative",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "product-2-icon",
                                                    label: "Text",
                                                    content: "👜",
                                                    type: "div",
                                                    style: {
                                                        fontSize: "48px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-2-tag",
                                                    label: "Text",
                                                    content: "SALE",
                                                    type: "div",
                                                    style: {
                                                        position: "absolute",
                                                        top: "12px",
                                                        right: "12px",
                                                        backgroundColor: "#e53e3e",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        padding: "5px 10px",
                                                        borderRadius: "4px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-2-wishlist",
                                                    label: "Text",
                                                    content: "❤️",
                                                    type: "div",
                                                    style: {
                                                        position: "absolute",
                                                        top: "12px",
                                                        left: "12px",
                                                        fontSize: "18px",
                                                        cursor: "pointer",
                                                        opacity: "0.7",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                        {
                                            id: "product-2-details",
                                            label: "Product Details",
                                            type: "div",
                                            content: "",
                                            style: {
                                                padding: "16px",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "product-2-title",
                                                    label: "Heading",
                                                    type: "h2",
                                                    content: "Designer Handbag",
                                                    style: {
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        marginBottom: "8px",
                                                        color: "#2d3748",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-2-category",
                                                    label: "Text",
                                                    type: "div",
                                                    content: "Women's Accessories",
                                                    style: {
                                                        fontSize: "14px",
                                                        color: "#718096",
                                                        marginBottom: "8px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "product-2-price-row",
                                                    label: "Price Row",
                                                    type: "div",
                                                    content: "",
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        marginTop: "8px",
                                                    },
                                                    isContainer: true,
                                                    closing: 1,
                                                    children: [
                                                        {
                                                            id: "product-2-price-container",
                                                            label: "Price Container",
                                                            type: "div",
                                                            content: "",
                                                            style: {
                                                                display: "flex",
                                                                gap: "8px",
                                                                alignItems: "center",
                                                            },
                                                            isContainer: true,
                                                            closing: 1,
                                                            children: [
                                                                {
                                                                    id: "product-2-price",
                                                                    label: "Text",
                                                                    type: "div",
                                                                    content: "$89.99",
                                                                    style: {
                                                                        fontWeight: "700",
                                                                        fontSize: "18px",
                                                                        color: "#2d3748",
                                                                    },
                                                                    closing: 1,
                                                                },
                                                                {
                                                                    id: "product-2-old-price",
                                                                    label: "Text",
                                                                    type: "div",
                                                                    content: "$129.99",
                                                                    style: {
                                                                        fontWeight: "400",
                                                                        fontSize: "14px",
                                                                        color: "#a0aec0",
                                                                        textDecoration: "line-through",
                                                                    },
                                                                    closing: 1,
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            id: "product-2-rating",
                                                            label: "Text",
                                                            type: "div",
                                                            content: "★★★★★",
                                                            style: {
                                                                color: "#ecc94b",
                                                                fontSize: "14px",
                                                            },
                                                            closing: 1,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                }

                            ]
                        }
                    ]
                },
                {
                    id: "footer",
                    label: "Footer Container",
                    type: "div",
                    content: "",
                    style: {
                        padding: "60px 20px 40px",
                        backgroundColor: "#1a202c",
                        color: "white",
                        textAlign: "center",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "footer-logo",
                            label: "Text",
                            type: "div",
                            content: "LUXEMART",
                            style: {
                                fontSize: "32px",
                                fontWeight: "800",
                                marginBottom: "30px",
                                color: "white",
                            },
                            closing: 1,
                        },
                        {
                            id: "footer-sections",
                            label: "Footer Sections",
                            type: "div",
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: "40px",
                                marginBottom: "30px",
                                textAlign: "left",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "customer-service",
                                    label: "Customer Service",
                                    type: "div",
                                    style: {},
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            type: "div",
                                            content: "Customer Service",
                                            style: {
                                                fontWeight: "700",
                                                marginBottom: "10px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Help Center",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Returns",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Shipping Info",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                                {
                                    id: "about",
                                    label: "About",
                                    type: "div",
                                    style: {},
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            type: "div",
                                            content: "About Us",
                                            style: {
                                                fontWeight: "700",
                                                marginBottom: "10px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Our Story",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Careers",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                                {
                                    id: "categories",
                                    label: "Categories",
                                    type: "div",
                                    style: {},
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            type: "div",
                                            content: "Shop",
                                            style: {
                                                fontWeight: "700",
                                                marginBottom: "10px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Men",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Women",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Kids",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                                {
                                    id: "social-media",
                                    label: "Social Media",
                                    type: "div",
                                    style: {},
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            type: "div",
                                            content: "Follow Us",
                                            style: {
                                                fontWeight: "700",
                                                marginBottom: "10px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Facebook",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Instagram",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                                marginBottom: "6px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            type: "a",
                                            content: "Twitter",
                                            href: "#",
                                            style: {
                                                color: "#cbd5e0",
                                                textDecoration: "none",
                                                display: "block",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "footer-copyright",
                            label: "Text",
                            type: "div",
                            content: "© 2025 LUXEMART. All rights reserved.",
                            style: {
                                fontSize: "14px",
                                color: "#a0aec0",
                                marginTop: "20px",
                            },
                            closing: 1,
                        },
                    ],
                }

            ]
        }


    ]
    const marketingAgencyTemplate = [
        {
            id: "main-container",
            label: "Main Container",
            type: "div",
            content: "",
            style: {
                padding: "0",
                margin: "0",
                fontFamily: "'Poppins', system-ui, sans-serif",
                color: "#333333",
                backgroundColor: "#ffffff",
                overflowX: "hidden",
            },
            isContainer: true,
            closing: 1,
            children: [
                // Header/Navigation
                {
                    id: "header",
                    label: "Header",
                    type: "header",
                    content: "",
                    style: {
                        padding: "20px 5%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        position: "sticky",
                        top: "0",
                        zIndex: "100",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "logo",
                            label: "Logo",
                            type: "div",
                            content: "SPARK",
                            style: {
                                fontSize: "28px",
                                fontWeight: "800",
                                color: "#ff4b00",
                                letterSpacing: "1px",
                            },
                            closing: 1,
                        },
                        {
                            id: "nav-links",
                            label: "Nav Links",
                            type: "nav",
                            content: "",
                            style: {
                                display: "flex",
                                gap: "30px",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "nav-home",
                                    label: "Nav Link",
                                    type: "a",
                                    content: "Home",
                                    href: "#",
                                    style: {
                                        color: "#333333",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "nav-services",
                                    label: "Nav Link",
                                    type: "a",
                                    content: "Services",
                                    href: "#services",
                                    style: {
                                        color: "#333333",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "nav-work",
                                    label: "Nav Link",
                                    type: "a",
                                    content: "Our Work",
                                    href: "#portfolio",
                                    style: {
                                        color: "#333333",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "nav-contact",
                                    label: "Nav Link",
                                    type: "a",
                                    content: "Contact",
                                    href: "#contact",
                                    style: {
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        backgroundColor: "#ff4b00",
                                        padding: "8px 20px",
                                        borderRadius: "4px",
                                    },
                                    closing: 1,
                                },
                            ],
                        },
                    ],
                },

                // Hero Section
                {
                    id: "hero-section",
                    label: "Hero Section",
                    type: "div",
                    content: "",
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "120px 5% 100px",
                        textAlign: "center",
                        backgroundColor: "#f8f9fa",
                        position: "relative",
                        overflow: "hidden",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "hero-accent",
                            label: "Hero Accent",
                            type: "div",
                            content: "",
                            style: {
                                position: "absolute",
                                top: "-5%",
                                right: "-5%",
                                width: "300px",
                                height: "300px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, rgba(255,75,0,0.1) 0%, rgba(255,138,0,0.05) 100%)",
                                zIndex: "1",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-tag",
                            label: "Hero Tag",
                            type: "div",
                            content: "INNOVATIVE MARKETING SOLUTIONS",
                            style: {
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#ff4b00",
                                marginBottom: "20px",
                                letterSpacing: "2px",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-heading",
                            label: "Hero Heading",
                            type: "h1",
                            content: "We Elevate Your Brand Through Creative Marketing",
                            style: {
                                fontSize: "48px",
                                fontWeight: "800",
                                marginBottom: "24px",
                                color: "#222222",
                                maxWidth: "800px",
                                lineHeight: "1.2",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-subheading",
                            label: "Hero Subheading",
                            type: "div",
                            content: "A full-service digital marketing agency helping businesses grow through strategic campaigns and compelling content.",
                            style: {
                                fontSize: "18px",
                                color: "#666666",
                                maxWidth: "600px",
                                margin: "0 auto 40px",
                                lineHeight: "1.6",
                            },
                            closing: 1,
                        },
                        {
                            id: "hero-cta",
                            label: "Hero CTA",
                            type: "a",
                            content: "Get a Free Consultation",
                            href: "#contact",
                            style: {
                                backgroundColor: "#ff4b00",
                                color: "#ffffff",
                                padding: "16px 32px",
                                fontSize: "16px",
                                fontWeight: "600",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "none",
                                transition: "all 0.3s ease",
                                display: "inline-block",
                            },
                            closing: 1,
                        },
                    ],
                },

                // Services Section
                {
                    id: "services-section",
                    label: "Services Section",
                    type: "div",
                    content: "",
                    style: {
                        padding: "100px 5%",
                        backgroundColor: "#ffffff",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "services-header",
                            label: "Services Header",
                            type: "div",
                            content: "",
                            style: {
                                textAlign: "center",
                                marginBottom: "60px",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "services-tag",
                                    label: "Services Tag",
                                    type: "div",
                                    content: "OUR SERVICES",
                                    style: {
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#ff4b00",
                                        marginBottom: "16px",
                                        letterSpacing: "2px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "services-heading",
                                    label: "Services Heading",
                                    type: "h2",
                                    content: "What We Do Best",
                                    style: {
                                        fontSize: "36px",
                                        fontWeight: "700",
                                        color: "#222222",
                                        marginBottom: "20px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "services-description",
                                    label: "Services Description",
                                    type: "div",
                                    content: "We offer a comprehensive range of digital marketing services to help your business thrive in today's competitive landscape.",
                                    style: {
                                        fontSize: "18px",
                                        color: "#666666",
                                        maxWidth: "700px",
                                        margin: "0 auto",
                                        lineHeight: "1.6",
                                    },
                                    closing: 1,
                                },
                            ],
                        },
                        {
                            id: "services-grid",
                            label: "Services Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "30px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Service Card 1
                                {
                                    id: "service-card-1",
                                    label: "Service Card 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "8px",
                                        padding: "40px 30px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        overflow: "hidden",
                                        position: "relative",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "service-icon-1",
                                            label: "Service Icon",
                                            type: "div",
                                            content: "📱",
                                            style: {
                                                fontSize: "40px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-title-1",
                                            label: "Service Title",
                                            type: "h3",
                                            content: "Social Media Marketing",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "15px",
                                                color: "#222222",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-description-1",
                                            label: "Service Description",
                                            type: "div",
                                            content: "Strategic social media campaigns to increase engagement, build brand awareness, and drive conversions.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#666666",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Service Card 2
                                {
                                    id: "service-card-2",
                                    label: "Service Card 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "8px",
                                        padding: "40px 30px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        overflow: "hidden",
                                        position: "relative",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "service-icon-2",
                                            label: "Service Icon",
                                            type: "div",
                                            content: "🔍",
                                            style: {
                                                fontSize: "40px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-title-2",
                                            label: "Service Title",
                                            type: "h3",
                                            content: "SEO & Content Strategy",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "15px",
                                                color: "#222222",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-description-2",
                                            label: "Service Description",
                                            type: "div",
                                            content: "Data-driven SEO and content strategies to improve your search rankings and attract qualified traffic.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#666666",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },

                                // Service Card 3
                                {
                                    id: "service-card-3",
                                    label: "Service Card 3",
                                    type: "div",
                                    content: "",
                                    style: {
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "8px",
                                        padding: "40px 30px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        overflow: "hidden",
                                        position: "relative",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "service-icon-3",
                                            label: "Service Icon",
                                            type: "div",
                                            content: "📊",
                                            style: {
                                                fontSize: "40px",
                                                marginBottom: "20px",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-title-3",
                                            label: "Service Title",
                                            type: "h3",
                                            content: "Paid Advertising",
                                            style: {
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                marginBottom: "15px",
                                                color: "#222222",
                                            },
                                            closing: 1,
                                        },
                                        {
                                            id: "service-description-3",
                                            label: "Service Description",
                                            type: "div",
                                            content: "Targeted PPC and display advertising campaigns optimized for maximum ROI and conversion rates.",
                                            style: {
                                                fontSize: "16px",
                                                color: "#666666",
                                                lineHeight: "1.6",
                                            },
                                            closing: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // Portfolio Section
                {
                    id: "portfolio-section",
                    label: "Portfolio Section",
                    type: "div",
                    content: "",
                    style: {
                        padding: "100px 5%",
                        backgroundColor: "#f8f9fa",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "portfolio-header",
                            label: "Portfolio Header",
                            type: "div",
                            content: "",
                            style: {
                                textAlign: "center",
                                marginBottom: "60px",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                {
                                    id: "portfolio-tag",
                                    label: "Portfolio Tag",
                                    type: "div",
                                    content: "OUR WORK",
                                    style: {
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#ff4b00",
                                        marginBottom: "16px",
                                        letterSpacing: "2px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "portfolio-heading",
                                    label: "Portfolio Heading",
                                    type: "h2",
                                    content: "Recent Success Stories",
                                    style: {
                                        fontSize: "36px",
                                        fontWeight: "700",
                                        color: "#222222",
                                        marginBottom: "20px",
                                    },
                                    closing: 1,
                                },
                                {
                                    id: "portfolio-description",
                                    label: "Portfolio Description",
                                    type: "div",
                                    content: "Take a look at some of our recent projects and the results we've achieved for our clients.",
                                    style: {
                                        fontSize: "18px",
                                        color: "#666666",
                                        maxWidth: "700px",
                                        margin: "0 auto",
                                        lineHeight: "1.6",
                                    },
                                    closing: 1,
                                },
                            ],
                        },
                        {
                            id: "portfolio-grid",
                            label: "Portfolio Grid",
                            type: "div",
                            content: "",
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                                gap: "30px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            },
                            isContainer: true,
                            closing: 1,
                            children: [
                                // Project Card 1
                                {
                                    id: "project-card-1",
                                    label: "Project Card 1",
                                    type: "div",
                                    content: "",
                                    style: {
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                        backgroundColor: "#ffffff",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "project-image-1",
                                            label: "Project Image Container",
                                            type: "div",
                                            content: "",
                                            style: {
                                                height: "200px",
                                                backgroundColor: "#ddd",
                                                position: "relative",
                                                overflow: "hidden",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "project-label-1",
                                                    label: "Project Label",
                                                    type: "div",
                                                    content: "E-COMMERCE",
                                                    style: {
                                                        position: "absolute",
                                                        bottom: "15px",
                                                        left: "15px",
                                                        backgroundColor: "#ff4b00",
                                                        color: "#ffffff",
                                                        padding: "6px 12px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        borderRadius: "4px",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                        {
                                            id: "project-content-1",
                                            label: "Project Content",
                                            type: "div",
                                            content: "",
                                            style: {
                                                padding: "25px",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "project-title-1",
                                                    label: "Project Title",
                                                    type: "h3",
                                                    content: "StyleHub Rebrand & Campaign",
                                                    style: {
                                                        fontSize: "20px",
                                                        fontWeight: "700",
                                                        marginBottom: "10px",
                                                        color: "#222222",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "project-description-1",
                                                    label: "Project Description",
                                                    type: "div",
                                                    content: "Complete brand refresh and digital marketing campaign resulting in 130% increase in online sales.",
                                                    style: {
                                                        fontSize: "15px",
                                                        color: "#666666",
                                                        lineHeight: "1.6",
                                                        marginBottom: "15px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "project-link-1",
                                                    label: "Project Link",
                                                    type: "a",
                                                    content: "View Case Study →",
                                                    href: "#",
                                                    style: {
                                                        color: "#ff4b00",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        textDecoration: "none",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },

                                // Project Card 2
                                {
                                    id: "project-card-2",
                                    label: "Project Card 2",
                                    type: "div",
                                    content: "",
                                    style: {
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                        backgroundColor: "#ffffff",
                                    },
                                    isContainer: true,
                                    closing: 1,
                                    children: [
                                        {
                                            id: "project-image-2",
                                            label: "Project Image Container",
                                            type: "div",
                                            content: "",
                                            style: {
                                                height: "200px",
                                                backgroundColor: "#ddd",
                                                position: "relative",
                                                overflow: "hidden",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "project-label-2",
                                                    label: "Project Label",
                                                    type: "div",
                                                    content: "SAAS",
                                                    style: {
                                                        position: "absolute",
                                                        bottom: "15px",
                                                        left: "15px",
                                                        backgroundColor: "#ff4b00",
                                                        color: "#ffffff",
                                                        padding: "6px 12px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        borderRadius: "4px",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                        {
                                            id: "project-content-2",
                                            label: "Project Content",
                                            type: "div",
                                            content: "",
                                            style: {
                                                padding: "25px",
                                            },
                                            isContainer: true,
                                            closing: 1,
                                            children: [
                                                {
                                                    id: "project-title-2",
                                                    label: "Project Title",
                                                    type: "h3",
                                                    content: "DataPro SEO & Content",
                                                    style: {
                                                        fontSize: "20px",
                                                        fontWeight: "700",
                                                        marginBottom: "10px",
                                                        color: "#222222",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "project-description-2",
                                                    label: "Project Description",
                                                    type: "div",
                                                    content: "SEO strategy and content overhaul that boosted organic traffic by 215% and doubled lead generation.",
                                                    style: {
                                                        fontSize: "15px",
                                                        color: "#666666",
                                                        lineHeight: "1.6",
                                                        marginBottom: "15px",
                                                    },
                                                    closing: 1,
                                                },
                                                {
                                                    id: "project-link-2",
                                                    label: "Project Link",
                                                    type: "a",
                                                    content: "View Case Study →",
                                                    href: "#",
                                                    style: {
                                                        color: "#ff4b00",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        textDecoration: "none",
                                                    },
                                                    closing: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                // CTA Section
                {
                    id: "cta-section",
                    label: "CTA Section",
                    type: "div",
                    content: "",
                    style: {
                        padding: "80px 5%",
                        backgroundColor: "#ff4b00",
                        color: "#ffffff",
                        textAlign: "center",
                    },
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            id: "cta-heading",
                            label: "CTA Heading",
                            type: "h2",
                            content: "Ready to Grow Your Business?",
                            style: {
                                fontSize: "36px",
                                fontWeight: "700",
                                marginBottom: "20px",
                            },
                            closing: 1,
                        },
                        {
                            id: "cta-description",
                            label: "CTA Description",
                            type: "div",
                            content: "Let's discuss how our marketing strategies can help you achieve your business goals.",
                            style: {
                                fontSize: "18px",
                                maxWidth: "700px",
                                margin: "0 auto 30px",
                                lineHeight: "1.6",
                                opacity: "0.9",
                            },
                            closing: 1,
                        },
                        {
                            id: "cta-button",
                            label: "CTA Button",
                            type: "a",
                            content: "Schedule a Free Consultation",
                            href: "#contact",
                            style: {
                                backgroundColor: "#ffffff",
                                color: "#ff4b00",
                                padding: "16px 32px",
                                fontSize: "16px",
                                fontWeight: "600",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                                transition: "all 0.3s ease",
                            },
                            closing: 1,
                        },
                    ],
                },
                {
    id: "footer",
    label: "Footer Container",
    type: "div",
    content: "",
    style: {
        padding: "60px 20px 40px",
        backgroundColor: "#1a202c",
        color: "white",
        textAlign: "center",
    },
    isContainer: true,
    closing: 1,
    children: [
        {
            id: "footer-logo",
            label: "Text",
            type: "div",
            content: "Spark",
            style: {
                fontSize: "32px",
                fontWeight: "800",
                marginBottom: "30px",
                color: "white",
            },
            closing: 1,
        },
        {
            id: "footer-sections",
            label: "Footer Sections",
            type: "div",
            style: {
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "40px",
                marginBottom: "30px",
                textAlign: "left",
            },
            isContainer: true,
            closing: 1,
            children: [
                {
                    id: "services",
                    label: "Services",
                    type: "div",
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            type: "div",
                            content: "Services",
                            style: {
                                fontWeight: "700",
                                marginBottom: "10px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "SEO",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Paid Ads",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Content Marketing",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                            },
                            closing: 1,
                        },
                    ],
                },
                {
                    id: "company",
                    label: "Company",
                    type: "div",
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            type: "div",
                            content: "Company",
                            style: {
                                fontWeight: "700",
                                marginBottom: "10px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "About Us",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Careers",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                            },
                            closing: 1,
                        },
                    ],
                },
                {
                    id: "resources",
                    label: "Resources",
                    type: "div",
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            type: "div",
                            content: "Resources",
                            style: {
                                fontWeight: "700",
                                marginBottom: "10px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Case Studies",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Blog",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "a",
                            content: "Free Tools",
                            href: "#",
                            style: {
                                color: "#cbd5e0",
                                display: "block",
                                textDecoration: "none",
                            },
                            closing: 1,
                        },
                    ],
                },
                {
                    id: "contact",
                    label: "Contact",
                    type: "div",
                    isContainer: true,
                    closing: 1,
                    children: [
                        {
                            type: "div",
                            content: "Contact",
                            style: {
                                fontWeight: "700",
                                marginBottom: "10px",
                            },
                            closing: 1,
                        },
                        {
                            type: "div",
                            content: "hello@Spark.com",
                            style: {
                                color: "#cbd5e0",
                                marginBottom: "6px",
                            },
                            closing: 1,
                        },
                        {
                            type: "div",
                            content: "+1 (800) 123-4567",
                            style: {
                                color: "#cbd5e0",
                            },
                            closing: 1,
                        },
                    ],
                },
            ],
        },
        {
            id: "social-links",
            label: "Social Media Links",
            type: "div",
            style: {
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "20px",
            },
            isContainer: true,
            closing: 1,
            children: [
                {
                    type: "a",
                    content: "LinkedIn",
                    href: "#",
                    style: {
                        color: "#cbd5e0",
                        textDecoration: "none",
                    },
                    closing: 1,
                },
                {
                    type: "a",
                    content: "Twitter",
                    href: "#",
                    style: {
                        color: "#cbd5e0",
                        textDecoration: "none",
                    },
                    closing: 1,
                },
                {
                    type: "a",
                    content: "YouTube",
                    href: "#",
                    style: {
                        color: "#cbd5e0",
                        textDecoration: "none",
                    },
                    closing: 1,
                },
            ],
        },
        {
            id: "footer-copyright",
            label: "Text",
            type: "div",
            content: "© 2025 Spark Marketing Agency. All rights reserved.",
            style: {
                fontSize: "14px",
                color: "#a0aec0",
                marginTop: "10px",
            },
            closing: 1,
        },
    ],
}


                
            ]
        }
    ]


    let Template = [];
    if (type === "saas") {
        Template = saasTemplate;

    }
    else if (type === "ecomm") {
        Template = ecommerceTemplate;
    }
    else{
        Template=marketingAgencyTemplate

    }
    const [components, setComponents] = useState(Template)


    const [selectedElement, setSelectedElement] = useState(null)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [isCodeExportModalOpen, setIsCodeExportModalOpen] = useState(false)
    const [userData, setUserData] = useState(null)



    useEffect(() => {
        // Check if user is authenticated
        const storedUserData = localStorage.getItem("userData")

        if (storedUserData) {
            setUserData(JSON.parse(storedUserData))
        }

    }, [])




    const handleMenuAction = (action) => {
        if (action === "logout") {
            onLogout()
        } else if (action === "profile") {
            // Navigate to profile page
        } else if (action === "settings") {
            // Navigate to settings page
        }
    }
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
        <div>
            <Navigation userData={userData} onMenuAction={handleMenuAction} />

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex h-screen overflow-hidden bg-slate-50">
                    <div className="w-1/5 p-4 border-r border-slate-200 overflow-y-auto bg-white shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 pb-2 border-b border-slate-200">Components</h2>
                        <ComponentCategoryList categories={componentCategories} />
                    </div>

                    <Canvas components={components} setComponents={setComponents} setSelectedElement={setSelectedElement} />

                    <RightPanel selectedElement={selectedElement} setComponents={setComponents} components={components} />

                    <div className="fixed bottom-6 right-6 flex gap-3 z-10">
                        <button
                            onClick={() => setIsPreviewModalOpen(true)}
                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none rounded-lg cursor-pointer shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-colors font-medium"
                        >
                            Preview
                        </button>

                        <button
                            onClick={() => setIsCodeExportModalOpen(true)}
                            className="px-5 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-none rounded-lg cursor-pointer shadow-lg hover:from-violet-600 hover:to-violet-700 transition-colors font-medium"
                        >
                            Export Code
                        </button>
                    </div>
                </div>

                <PreviewModal components={components} isOpen={isPreviewModalOpen} setIsOpen={setIsPreviewModalOpen} />

                <CodeExportModal components={components} isOpen={isCodeExportModalOpen} setIsOpen={setIsCodeExportModalOpen} />
            </DndContext>
        </div>

    )
}
