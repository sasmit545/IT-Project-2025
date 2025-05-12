"use client";

import { useState, useEffect } from "react";
import { useParams ,useNavigate } from "react-router-dom";
import {
  DndContext,
  useDndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import {
  FaParagraph,
  FaSquare,
  FaBox,
  FaHeading,
  FaImage,
  FaListUl,
  FaLink,
} from "react-icons/fa";
import "./editor.css";
import Navigation from "../../components/navigation";
import axios from "axios";


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
    onClick: {
      action: "none",
      options: {
        link: "",
        target: "_blank",
        customJs: "",
      },
    },
    onHover: {
      action: "none",
      options: {
        style: {
          backgroundColor: "",
          color: "",
          borderColor: "",
          transform: "",
        },
        tooltip: "",
      },
    },
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
];

// Icons mapped by component id
const categoryIcons = {
  text: <FaParagraph className="h-5 w-5" />, // better for text/paragraph
  button: <FaSquare className="h-5 w-5" />, // simple block-like button
  container: <FaBox className="h-5 w-5" />, // container/box metaphor
  heading: <FaHeading className="h-5 w-5" />, // clear for headings/titles
  image: <FaImage className="h-5 w-5" />, // image icon
  list: <FaListUl className="h-5 w-5" />, // unordered list
  link: <FaLink className="h-5 w-5" />, // link icon
};
const componentColors = {
  text: "bg-gradient-to-r from-rose-100 via-rose-200 to-pink-200",
  heading: "bg-gradient-to-r from-sky-100 via-sky-200 to-blue-200",
  button: "bg-gradient-to-r from-emerald-100 via-green-200 to-lime-200",
  container: "bg-gradient-to-r from-cyan-100 via-teal-100 to-sky-100",
  image: "bg-gradient-to-r from-violet-100 via-purple-200 to-indigo-200",
  list: "bg-gradient-to-r from-yellow-100 via-amber-200 to-orange-100",
  link: "bg-gradient-to-r from-teal-100 via-cyan-200 to-blue-100",
};

// Categories
const componentCategories = [
  {
    id: "basic",
    label: "Basic Elements",
    components: ["text", "heading", "button"],
  },
  { id: "layout", label: "Layout", components: ["container"] },
  { id: "media", label: "Media", components: ["image"] },
  { id: "navigation", label: "Navigation", components: ["link", "list"] },
];

// onClick Property Editor Component
function OnClickPropertyEditor({ selectedComponent, onUpdateComponent }) {
  const onClick = selectedComponent.onClick || { action: "none", options: {} };

  const handleActionChange = (e) => {
    const newOnClick = {
      ...onClick,
      action: e.target.value,
      options: onClick.options || {},
    };
    onUpdateComponent({ ...selectedComponent, onClick: newOnClick });
  };

  const handleOptionsChange = (key, value) => {
    const newOnClick = {
      ...onClick,
      options: {
        ...onClick.options,
        [key]: value,
      },
    };
    onUpdateComponent({ ...selectedComponent, onClick: newOnClick });
  };

  return (
    <div className="property-group">
      <h3 className="property-group-title">On Click</h3>
      <div className="property-field">
        <label>Action</label>
        <select value={onClick.action} onChange={handleActionChange}>
          <option value="none">None</option>
          <option value="link">Navigate to URL</option>
          <option value="submit">Submit Form</option>
          <option value="custom">Custom JS</option>
        </select>
      </div>

      {onClick.action === "link" && (
        <>
          <div className="property-field">
            <label>URL</label>
            <input
              type="text"
              value={onClick.options.link || ""}
              onChange={(e) => handleOptionsChange("link", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="property-field">
            <label>Open in</label>
            <select
              value={onClick.options.target || "_blank"}
              onChange={(e) => handleOptionsChange("target", e.target.value)}
            >
              <option value="_blank">New Window</option>
              <option value="_self">Same Window</option>
            </select>
          </div>
        </>
      )}

      {onClick.action === "custom" && (
        <div className="property-field">
          <label>Custom JavaScript</label>
          <textarea
            value={onClick.options.customJs || ""}
            onChange={(e) => handleOptionsChange("customJs", e.target.value)}
            placeholder="console.log('Button clicked');"
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

// onHover Property Editor Component
function OnHoverPropertyEditor({ selectedComponent, onUpdateComponent }) {
  const onHover = selectedComponent.onHover || {
    action: "none",
    options: { style: {} },
  };

  const handleActionChange = (e) => {
    const newOnHover = {
      ...onHover,
      action: e.target.value,
      options: onHover.options || { style: {} },
    };
    onUpdateComponent({ ...selectedComponent, onHover: newOnHover });
  };

  const handleStyleChange = (styleKey, value) => {
    const newOnHover = {
      ...onHover,
      options: {
        ...onHover.options,
        style: {
          ...onHover.options.style,
          [styleKey]: value,
        },
      },
    };
    onUpdateComponent({ ...selectedComponent, onHover: newOnHover });
  };

  const handleTooltipChange = (value) => {
    const newOnHover = {
      ...onHover,
      options: {
        ...onHover.options,
        tooltip: value,
      },
    };
    onUpdateComponent({ ...selectedComponent, onHover: newOnHover });
  };

  return (
    <div className="property-group">
      <h3 className="property-group-title">On Hover</h3>
      <div className="property-field">
        <label>Effect</label>
        <select value={onHover.action} onChange={handleActionChange}>
          <option value="none">None</option>
          <option value="style">Change Style</option>
          <option value="tooltip">Show Tooltip</option>
        </select>
      </div>

      {onHover.action === "style" && (
        <>
          <div className="property-field">
            <label>Background Color</label>
            <input
              type="color"
              value={onHover.options.style.backgroundColor || "#ffffff"}
              onChange={(e) =>
                handleStyleChange("backgroundColor", e.target.value)
              }
            />
          </div>
          <div className="property-field">
            <label>Text Color</label>
            <input
              type="color"
              value={onHover.options.style.color || "#000000"}
              onChange={(e) => handleStyleChange("color", e.target.value)}
            />
          </div>
          <div className="property-field">
            <label>Border Color</label>
            <input
              type="color"
              value={onHover.options.style.borderColor || "#000000"}
              onChange={(e) => handleStyleChange("borderColor", e.target.value)}
            />
          </div>
          <div className="property-field">
            <label>Transform</label>
            <select
              value={onHover.options.style.transform || "none"}
              onChange={(e) => handleStyleChange("transform", e.target.value)}
            >
              <option value="none">None</option>
              <option value="scale(1.05)">Scale Up</option>
              <option value="scale(0.95)">Scale Down</option>
              <option value="translateY(-2px)">Move Up</option>
            </select>
          </div>
        </>
      )}

      {onHover.action === "tooltip" && (
        <div className="property-field">
          <label>Tooltip Text</label>
          <input
            type="text"
            value={onHover.options.tooltip || ""}
            onChange={(e) => handleTooltipChange(e.target.value)}
            placeholder="Enter tooltip text"
          />
        </div>
      )}
    </div>
  );
}

function DraggableComponent({ id, content, icon }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const { active } = useDndContext();

  const isDragging = active?.id === id;

  // Create a clone for dragging that follows the cursor exactly
  useEffect(() => {
    if (isDragging) {
      // Create a clone element that will follow the cursor
      const clone = document.createElement("div");
      clone.id = "dragging-clone";
      clone.className = `p-4 ${componentColors[id]} rounded-xl shadow-md border border-violet-200 flex items-center gap-4 fixed z-50`;
      clone.style.width = "12rem";
      clone.style.pointerEvents = "none";

      // Add icon and content to the clone
      if (icon) {
        const iconSpan = document.createElement("span");
        iconSpan.className = "text-gray-600 text-2xl";
        // We need to render the icon as HTML
        iconSpan.innerHTML = document.querySelector(
          `[data-draggable-id="${id}"] span`
        ).innerHTML;
        clone.appendChild(iconSpan);
      }

      const contentSpan = document.createElement("span");
      contentSpan.className = "text-sm font-medium text-gray-800";
      contentSpan.textContent = content;
      clone.appendChild(contentSpan);

      document.body.appendChild(clone);

      // Position the clone at the cursor position
      const updateClonePosition = (e) => {
        if (clone) {
          clone.style.left = `${e.clientX}px`;
          clone.style.top = `${e.clientY}px`;
          clone.style.transform = "translate(-50%, -50%)";
        }
      };

      document.addEventListener("mousemove", updateClonePosition);

      return () => {
        document.removeEventListener("mousemove", updateClonePosition);
        if (clone && clone.parentNode) {
          document.body.removeChild(clone);
        }
      };
    }
  }, [isDragging, id, content, icon]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-draggable-id={id}
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
      `}
    >
      {icon && <span className="text-gray-600 text-2xl">{icon}</span>}
      <span className="text-sm font-medium text-gray-800">{content}</span>
    </div>
  );
}

// Expandable category list
function ComponentCategoryList({ categories }) {
  const [expandedCategories, setExpandedCategories] = useState(
    categories.map((cat) => cat.id)
  );

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
                const comp = componentsList.find((c) => c.id === compId);
                return (
                  comp && (
                    <DraggableComponent
                      key={comp.id}
                      id={comp.id}
                      content={comp.label}
                      icon={categoryIcons[comp.id]}
                    />
                  )
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NestedDroppable({
  component,
  componentPath,
  components,
  setComponents,
  setSelectedElement,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${componentPath.join("-")}`,
  });

  const updateContent = (newContent) => {
    const updatedComponents = [...components];
    let currentLevel = updatedComponents;

    // Navigate to the correct nesting level except the last index
    for (let i = 0; i < componentPath.length - 1; i++) {
      currentLevel = currentLevel[componentPath[i]].children;
    }

    // Update the content
    currentLevel[componentPath[componentPath.length - 1]].content = newContent;
    setComponents(updatedComponents);
  };

  const handleDrop = (draggedComponent) => {
    const updatedComponents = [...components];
    let currentLevel = updatedComponents;

    // Navigate to the correct nesting level except the last index
    for (let i = 0; i < componentPath.length - 1; i++) {
      if (componentPath[i] === "children") {
        continue; // Skip "children" in the path
      }
      if (i < componentPath.length - 2 && componentPath[i + 1] === "children") {
        currentLevel = currentLevel[componentPath[i]].children;
      } else {
        currentLevel = currentLevel[componentPath[i]];
      }
    }

    // Add to children array of the target container
    const lastIndex = componentPath[componentPath.length - 1];
    if (!currentLevel[lastIndex].children) {
      currentLevel[lastIndex].children = [];
    }
    currentLevel[lastIndex].children.push({
      ...draggedComponent,
      style: { ...draggedComponent.style },
      children: draggedComponent.isContainer ? [] : undefined,
    });

    setComponents(updatedComponents);
  };

  const handleDeleteComponent = (index) => {
    const updatedComponents = [...components];
    let currentLevel = updatedComponents;

    // Navigate to the correct nesting level except the last index
    for (let i = 0; i < componentPath.length - 1; i++) {
      if (componentPath[i] === "children") {
        continue; // Skip "children" in the path
      }
      if (i < componentPath.length - 2 && componentPath[i + 1] === "children") {
        currentLevel = currentLevel[componentPath[i]].children;
      } else {
        currentLevel = currentLevel[componentPath[i]];
      }
    }

    // Remove the child at specified index
    const lastIndex = componentPath[componentPath.length - 1];
    if (currentLevel[lastIndex].children) {
      currentLevel[lastIndex].children.splice(index, 1);
      setComponents(updatedComponents);
    }
  };

  // This will be used by the parent DndContext
  component.handleDrop = handleDrop;

  const containerStyle = {
    ...component.style,
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${isOver
        ? "bg-violet-50 border-violet-300"
        : "border-dashed border-gray-300"
        } border`}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement({ path: componentPath, ...component });
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
                e.stopPropagation();
                handleDeleteComponent(childIndex);
              }}
              className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs opacity-80 hover:opacity-100"
              aria-label="Delete component"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

      {component.isContainer && component.children.length === 0 && (
        <div className="text-center py-5 text-slate-500">
          Drop components here
        </div>
      )}
    </div>
  );
}

function RenderComponent({
  component,
  componentPath,
  components,
  setComponents,
  setSelectedElement,
}) {
  if (component.isContainer) {
    return (
      <NestedDroppable
        component={component}
        componentPath={componentPath}
        components={components}
        setComponents={setComponents}
        setSelectedElement={setSelectedElement}
      />
    );
  }

  const updateContent = (newContent) => {
    const updatedComponents = [...components];
    let currentLevel = updatedComponents;

    // Navigate to the correct nesting level
    for (let i = 0; i < componentPath.length; i++) {
      if (componentPath[i] === "children") {
        continue;
      }
      if (i === componentPath.length - 1) {
        currentLevel[componentPath[i]].content = newContent;
      } else if (
        i < componentPath.length - 2 &&
        componentPath[i + 1] === "children"
      ) {
        currentLevel = currentLevel[componentPath[i]].children;
      } else {
        currentLevel = currentLevel[componentPath[i]];
      }
    }

    setComponents(updatedComponents);
  };

  const ComponentType = component.type;

  const props = {
    style: { ...component.style },
    onClick: (e) => {
      e.stopPropagation();
      setSelectedElement({ path: componentPath, ...component });

      if (component.onClick) {
        const { action, options } = component.onClick;
        if (action === "link" && options.link) {
          window.open(options.link, options.target || "_blank");
        } else if (action === "submit") {
          // Implement form submission logic if needed
          console.log("Form submitted (simulate)");
        } else if (action === "custom" && options.customJs) {
          try {
            // ⚠️ Warning: eval can be dangerous!
            // Use sandboxing if you expose this to untrusted users
            new Function(options.customJs)();
          } catch (error) {
            console.error("Custom JS Error:", error);
          }
        }
      }
    },
    onMouseEnter: (e) => {
      if (component.onHover?.action === "style") {
        Object.assign(e.currentTarget.style, component.onHover.options?.style);
      } else if (component.onHover?.action === "tooltip") {
        const tooltipText = component.onHover.options?.tooltip;
        if (tooltipText) {
          e.currentTarget.setAttribute("title", tooltipText);
        }
      }
    },
    onMouseLeave: (e) => {
      if (component.onHover?.action === "style") {
        // Reset to original style (not perfect, consider caching original)
        Object.assign(e.currentTarget.style, component.style || {});
      } else {
        e.currentTarget.removeAttribute("title");
      }
    },
  };

  // Handle special component types
  if (ComponentType === "img") {
    return (
      <img
        src={
          component.src ||
          "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_1280.png"
        }
        alt={component.alt || "Image"}
        {...props}
      />
    );
  } else if (ComponentType === "a") {
    return (
      <a
        href={component.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        dangerouslySetInnerHTML={{ __html: component.content }}
      />
    );
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
  );
}

function Canvas({ components, setComponents, setSelectedElement }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [historyStack, setHistoryStack] = useState([]);
  const [futureStack, setFutureStack] = useState([]);

  useEffect(() => {
    // Save current state to history when components change (debounced)
    const debounceTimer = setTimeout(() => {
      if (
        historyStack.length === 0 ||
        JSON.stringify(historyStack[historyStack.length - 1]) !==
        JSON.stringify(components)
      ) {
        setHistoryStack((prev) => [
          ...prev,
          JSON.parse(JSON.stringify(components)),
        ]);
        setFutureStack([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [components]);

  const handleDeleteComponent = (index) => {
    setComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      newComponents.splice(index, 1);
      return newComponents;
    });
  };

  const handleUndo = () => {
    if (historyStack.length > 1) {
      const newHistoryStack = [...historyStack];
      const currentState = newHistoryStack.pop();
      setHistoryStack(newHistoryStack);
      setFutureStack((prev) => [...prev, currentState]);
      setComponents(newHistoryStack[newHistoryStack.length - 1]);
    }
  };

  const handleRedo = () => {
    if (futureStack.length > 0) {
      const newFutureStack = [...futureStack];
      const nextState = newFutureStack.pop();
      setFutureStack(newFutureStack);
      setHistoryStack((prev) => [...prev, nextState]);
      setComponents(nextState);
    }
  };

  return (
    <div className="w-3/5 flex flex-col">
      <div
        className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex gap-2 
      items-center shadow-sm"
      >
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
        className={`min-h-[400px] border-2 border-dashed ${isOver
          ? "border-violet-400 bg-violet-100"
          : "border-slate-300 bg-slate-50"
          } p-4 flex flex-col gap-3 overflow-auto flex-1 relative transition-colors duration-200`}
      >
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-lg">Drag elements here to start building</p>
            <p className="text-sm mt-2">
              Select components from the left panel
            </p>
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
  );
}

function RightPanel({ selectedElement, setComponents, components }) {
  const [element, setElement] = useState(selectedElement);

  useEffect(() => {
    setElement(selectedElement);
  }, [selectedElement]);

  if (!selectedElement)
    return (
      <div className="w-1/5 p-4 border-l border-slate-200 bg-slate-50">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Style Editor
          </h3>
          <p className="text-slate-500 text-sm">
            Select an element to edit its properties
          </p>
          <div className="mt-6 p-4 border border-dashed border-slate-300 rounded-lg">
            <p className="text-slate-400 text-xs">
              Click on any element in the canvas to customize its appearance and
              behavior
            </p>
          </div>
        </div>
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

  // Function to update multiple style properties at once
  const updateMultipleStyles = (styleObject) => {
    Object.entries(styleObject).forEach(([property, value]) => {
      updateStyle(property, value);
    });
  };

  const updateComponentByPath = (updatedComponent) => {
    const updatedComponents = [...components];
    const path = selectedElement.path;
    let currentLevel = updatedComponents;

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        currentLevel[path[i]] = updatedComponent;
      } else if (path[i] === "children") {
        currentLevel = currentLevel.children;
      } else {
        currentLevel = currentLevel[path[i]];
      }
    }

    setComponents(updatedComponents);
    setElement(updatedComponent);
  };

  return (
    <div className="w-1/5 p-4 border-l border-slate-200 bg-slate-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
        <h3 className="text-lg font-medium text-slate-800 mb-2">
          Element Properties
        </h3>
        <div className="p-2 bg-slate-50 rounded-md border border-slate-200">
          <label className="font-medium text-slate-700 block mb-1">
            Type:{" "}
            <span className="font-normal text-slate-500">{element?.type}</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
        <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
          Text Styles
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Text Color:{" "}
            </label>
            <input
              type="color"
              onChange={(e) => updateStyle("color", e.target.value)}
              value={element?.style?.color || "#000000"}
              className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Font Size:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Font Weight:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Font Family:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Text Transform:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Line Height:{" "}
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                onChange={(e) =>
                  updateStyle("lineHeight", `${e.target.value}%`)
                }
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Letter Spacing:{" "}
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="-3"
                max="10"
                step="0.5"
                onChange={(e) =>
                  updateStyle("letterSpacing", `${e.target.value}px`)
                }
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Text Decoration:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Text Shadow:{" "}
            </label>
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
        <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
          Layout
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Text Align:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Display Type:
            </label>
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Flex Direction:
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => updateStyle("flexDirection", "row")}
                  className={`p-2 border ${element?.style?.flexDirection === "row" ||
                    !element?.style?.flexDirection
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Justify Content:
              </label>
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Align Items:
              </label>
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Gap:{" "}
              </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Position:{" "}
            </label>
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
          {element?.style?.position &&
            element?.style?.position !== "static" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Top:{" "}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      onChange={(e) =>
                        updateStyle("marginBottom", `${e.target.value}px`)
                      }
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
                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Left:{" "}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      onChange={(e) =>
                        updateStyle("left", `${e.target.value}px`)
                      }
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
          {element?.style?.position &&
            element?.style?.position !== "static" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Z-Index:{" "}
                </label>
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
        <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
          Box Styles
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Background:{" "}
            </label>
            <input
              type="color"
              onChange={(e) => updateStyle("background", e.target.value)}
              value={element?.style?.background || "#FFFFFF"}
              className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
            />
          </div>

          {/* NEW: Background Opacity */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Background Opacity:{" "}
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                onChange={(e) => {
                  const opacity = e.target.value / 100;
                  let bgColor = element?.style?.background || "#FFFFFF";

                  // Check if background is already in rgba format
                  if (bgColor.startsWith("rgba")) {
                    // Replace the opacity value in the rgba string
                    bgColor = bgColor.replace(
                      /rgba$$(\d+),\s*(\d+),\s*(\d+),\s*[\d.]+$$/,
                      `rgba($1, $2, $3, ${opacity})`
                    );
                  }
                  // Check if background is in hex format
                  else if (bgColor.startsWith("#")) {
                    // Convert hex to rgba
                    const r = Number.parseInt(bgColor.slice(1, 3), 16);
                    const g = Number.parseInt(bgColor.slice(3, 5), 16);
                    const b = Number.parseInt(bgColor.slice(5, 7), 16);
                    bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                  }

                  updateStyle("background", bgColor);
                }}
                value={
                  element?.style?.background?.startsWith("rgba")
                    ? Number.parseFloat(
                      element.style.background.match(
                        /rgba$$(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)$$/
                      )[4]
                    ) * 100
                    : 100
                }
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <span className="ml-3 min-w-[40px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                {element?.style?.background?.startsWith("rgba")
                  ? Math.round(
                    Number.parseFloat(
                      element.style.background.match(
                        /rgba$$(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)$$/
                      )[4]
                    ) * 100
                  )
                  : 100}
                %
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
              value={element?.style?.backgroundImage?.replace(/url$$['"]?(.*?)['"]?$$/i, '$1') || ''}
              className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
            />
          </div> */}

          {/* NEW: Background Position */}
          {element?.style?.backgroundImage &&
            element?.style?.backgroundImage !== "none" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Background Position:{" "}
                </label>
                <select
                  onChange={(e) =>
                    updateStyle("backgroundPosition", e.target.value)
                  }
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
          {element?.style?.backgroundImage &&
            element?.style?.backgroundImage !== "none" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Background Size:{" "}
                </label>
                <select
                  onChange={(e) =>
                    updateStyle("backgroundSize", e.target.value)
                  }
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Padding:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Padding (Individual):{" "}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Top:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("paddingTop", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.paddingTop) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Right:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("paddingRight", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.paddingRight) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Bottom:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("paddingBottom", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.paddingBottom) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Left:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("paddingLeft", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.paddingLeft) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Margin:{" "}
            </label>
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
            <label className="block mb-1  font-medium text-slate-700">
              Margin (Individual):{" "}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Top:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("marginTop", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.marginTop) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-red-500 text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Right:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("marginRight", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.marginRight) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Bottom:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("marginBottom", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.marginBottom) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-black text-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />

                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Left:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("marginLeft", `${e.target.value}px`)
                    }
                    value={Number.parseInt(element?.style?.marginLeft) || 0}
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Border Radius:{" "}
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="50"
                onChange={(e) =>
                  updateStyle("borderRadius", `${e.target.value}px`)
                }
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Border Radius (Individual):{" "}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Top Left:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("borderTopLeftRadius", `${e.target.value}px`)
                    }
                    value={
                      Number.parseInt(element?.style?.borderTopLeftRadius) || 0
                    }
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Top Right:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle("borderTopRightRadius", `${e.target.value}px`)
                    }
                    value={
                      Number.parseInt(element?.style?.borderTopRightRadius) || 0
                    }
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Bottom Left:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle(
                        "borderBottomLeftRadius",
                        `${e.target.value}px`
                      )
                    }
                    value={
                      Number.parseInt(element?.style?.borderBottomLeftRadius) ||
                      0
                    }
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-600">
                  Bottom Right:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      updateStyle(
                        "borderBottomRightRadius",
                        `${e.target.value}px`
                      )
                    }
                    value={
                      Number.parseInt(
                        element?.style?.borderBottomRightRadius
                      ) || 0
                    }
                    className="w-full p-1 border border-slate-300 rounded bg-white text-sm"
                    style={{
                      backgroundColor: "#f5f3ff",
                    }}
                  />
                  <span className="ml-1 bg-violet-100 p-1 text-xs rounded">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Border:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Border Color:{" "}
            </label>
            <input
              type="color"
              onChange={(e) => {
                // If there's already a border, replace its color
                if (
                  element?.style?.border &&
                  element?.style?.border !== "none"
                ) {
                  const borderParts = element.style.border.split(" ");
                  if (borderParts.length >= 3) {
                    borderParts[2] = e.target.value;
                    updateStyle("border", borderParts.join(" "));
                  } else {
                    // If border format is unexpected, just set new border with the color
                    updateStyle("border", `1px solid ${e.target.value}`);
                  }
                } else {
                  // No existing border, create a new one
                  updateStyle("border", `1px solid ${e.target.value}`);
                }
              }}
              value={element?.style?.border?.split(" ")[2] || "#000000"}
              className="w-full h-8 rounded-md border border-slate-900 shadow-sm cursor-pointer"
            />
          </div>

          {/* NEW: Box Shadow */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Box Shadow:{" "}
            </label>
            <select
              onChange={(e) => updateStyle("boxShadow", e.target.value)}
              value={element?.style?.boxShadow || "none"}
              className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
            >
              <option value="none">None</option>
              <option value="0 1px 3px rgba(0,0,0,0.12)">Light</option>
              <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
              <option value="0 10px 15px -3px rgba(0,0,0,0.1)">Large</option>
              <option value="0 20px 25px -5px rgba(0,0,0,0.1)">
                Extra Large
              </option>
              <option value="0 0 15px rgba(0,0,0,0.1)">Soft Glow</option>
              <option value="rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(0, 0, 0, 0.1) 0px 0px 0px 3px">
                Outline
              </option>
              <option value="rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px">
                Layered
              </option>
              <option value="rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px">
                Stacked
              </option>
            </select>
          </div>

          {/* NEW: Opacity */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Opacity:{" "}
            </label>
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
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Overflow:{" "}
            </label>
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
          <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
            Link Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                URL:{" "}
              </label>
              <input
                type="text"
                onChange={(e) => updateAttribute("href", e.target.value)}
                value={element?.href || "#"}
                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Opens in:{" "}
              </label>
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
          <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
            Image Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Image URL:{" "}
              </label>
              <input
                type="text"
                onChange={(e) => updateAttribute("src", e.target.value)}
                value={element?.src || ""}
                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Alt Text:{" "}
              </label>
              <input
                type="text"
                onChange={(e) => updateAttribute("alt", e.target.value)}
                value={element?.alt || ""}
                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
              />
            </div>

            {/* NEW: Object Fit */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Object Fit:{" "}
              </label>
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Object Position:{" "}
              </label>
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
          <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
            Container Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Width:{" "}
              </label>
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Min Height:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="50"
                  max="500"
                  onChange={(e) =>
                    updateStyle("minHeight", `${e.target.value}px`)
                  }
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Max Width:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  onChange={(e) =>
                    updateStyle(
                      "maxWidth",
                      e.target.value === "0" ? "none" : `${e.target.value}px`
                    )
                  }
                  value={
                    element?.style?.maxWidth === "none"
                      ? 0
                      : Number.parseInt(element?.style?.maxWidth) || 0
                  }
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <span className="ml-3 min-w-[50px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                  {element?.style?.maxWidth === "none"
                    ? "None"
                    : `${Number.parseInt(element?.style?.maxWidth) || 0}px`}
                </span>
              </div>
            </div>

            {/* NEW: Max Height */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Max Height:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  onChange={(e) =>
                    updateStyle(
                      "maxHeight",
                      e.target.value === "0" ? "none" : `${e.target.value}px`
                    )
                  }
                  value={
                    element?.style?.maxHeight === "none"
                      ? 0
                      : Number.parseInt(element?.style?.maxHeight) || 0
                  }
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <span className="ml-3 min-w-[50px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                  {element?.style?.maxHeight === "none"
                    ? "None"
                    : `${Number.parseInt(element?.style?.maxHeight) || 0}px`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {element?.type === "button" && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
          <h4 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-200">
            Button Settings
          </h4>
          <div className="space-y-4">
            <OnClickPropertyEditor
              selectedComponent={element}
              onUpdateComponent={updateComponentByPath}
            />

            <OnHoverPropertyEditor
              selectedComponent={element}
              onUpdateComponent={updateComponentByPath}
            />

            {/* Button Text Size */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Text Size:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="12"
                  max="24"
                  onChange={(e) =>
                    updateStyle("fontSize", `${e.target.value}px`)
                  }
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Padding:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="4"
                  max="20"
                  onChange={(e) => {
                    const value = e.target.value;
                    updateStyle(
                      "padding",
                      `${Math.floor(value / 2)}px ${value}px`
                    );
                  }}
                  value={
                    Number.parseInt(
                      (element?.style?.padding || "10px 20px").split(" ")[1]
                    ) || 20
                  }
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <span className="ml-3 min-w-[60px] text-center text-sm font-medium bg-violet-100 py-1 px-2 rounded">
                  {Number.parseInt(
                    (element?.style?.padding || "10px 20px").split(" ")[1]
                  ) || 20}
                  px
                </span>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Border Radius:{" "}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="24"
                  onChange={(e) =>
                    updateStyle("borderRadius", `${e.target.value}px`)
                  }
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
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Cursor:{" "}
              </label>
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

      <div className="h-16"></div>
    </div>
  );
}

function PreviewModal({ components, isOpen, setIsOpen }) {
  if (!isOpen) return null;

  const renderComponentToHTML = (comp) => {
    const styleStr = Object.entries(comp.style || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");

    // Handle self-closing tags
    if (comp.closing === 0) {
      return `<${comp.type} style="${styleStr}" ${comp.src ? `src="${comp.src}"` : ""
        } ${comp.alt ? `alt="${comp.alt}"` : ""} />`;
    }

    // Handle container with children
    let childrenHTML = "";
    if (comp.children && comp.children.length > 0) {
      childrenHTML = comp.children
        .map((child) => renderComponentToHTML(child))
        .join("");
    }

    return `<${comp.type} style="${styleStr}" ${comp.href ? `href="${comp.href}"` : ""
      }>${comp.content || ""}${childrenHTML}</${comp.type}>`;
  };

  const htmlOutput = components
    .map((comp) => renderComponentToHTML(comp))
    .join("");

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
              const blob = new Blob([htmlOutput], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "page.html";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none rounded-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-md font-medium"
          >
            Export HTML
          </button>

          <button
            onClick={() => {
              const jsonStr = JSON.stringify(components, null, 2);
              const blob = new Blob([jsonStr], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "components.json";
              a.click();
              URL.revokeObjectURL(url);
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
          <h3 className="text-lg font-medium mb-2.5 text-slate-800">
            HTML Output
          </h3>
          <pre className="whitespace-pre-wrap text-xs bg-violet-100 p-3 rounded border border-slate-200 overflow-x-auto">
            {htmlOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

function CodeExportModal({ components, isOpen, setIsOpen }) {
  if (!isOpen) return null;
  const generateReactCode = () => {
    const imports = `import React from 'react';\n\n`;

    const renderComponentToJSX = (comp, indent = 0) => {
      const indentStr = " ".repeat(indent * 2);
      const styleObj = JSON.stringify(comp.style || {}, null, 2)
        .replace(/"/g, "")
        .replace(/,\n/g, ",\n" + indentStr + "  ");

      // Handle self-closing tags
      if (comp.closing === 0) {
        return `${indentStr}<${comp.type
          }\n${indentStr}  style={${styleObj}}\n${indentStr}  ${comp.src ? `src="${comp.src}"` : ""
          }\n${indentStr}  ${comp.alt ? `alt="${comp.alt}"` : ""
          }\n${indentStr}/>`;
      }

      // Handle container with children
      let childrenJSX = "";
      if (comp.children && comp.children.length > 0) {
        childrenJSX = comp.children
          .map((child) => renderComponentToJSX(child, indent + 1))
          .join("\n");
        return `${indentStr}<${comp.type} style={${styleObj}} ${comp.href ? `href="${comp.href}"` : ""
          }>\n${comp.content ? `${indentStr}  ${comp.content}\n` : ""
          }${childrenJSX}\n${indentStr}</${comp.type}>`;
      }

      return `${indentStr}<${comp.type} style={${styleObj}} ${comp.href ? `href="${comp.href}"` : ""
        }>${comp.content || ""}</${comp.type}>`;
    };

    const componentJSX = components
      .map((comp) => renderComponentToJSX(comp))
      .join("\n");

    return `${imports}export default function GeneratedComponent() {
  return (
    <div>
${componentJSX}
    </div>
  );
}`;
  };

  const reactCode = generateReactCode();

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

        <h2 className="text-2xl font-bold mb-5 text-slate-800">
          Export React Code
        </h2>

        <div className="flex gap-5 mb-5">
          <button
            onClick={() => {
              const blob = new Blob([reactCode], { type: "text/javascript" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "GeneratedComponent.jsx";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none rounded-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-md font-medium"
          >
            Download React Component
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(reactCode);
              alert("Code copied to clipboard!");
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
  );
}

export default function PageBuilder({ onLogout }) {
  let { websiteId } = useParams();
  const [components, setComponents] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCodeExportModalOpen, setIsCodeExportModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
        const navigate = useNavigate();


  useEffect(() => {
    // Check if user is authenticated
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    if (websiteId !== "new") {

      getSourceCode().then((sourceCode) => {

        if (!Array.isArray(sourceCode)) {
          console.error("Fetched sourceCode is not an array:", sourceCode);
          return;
        }

        const comp = JSON.parse(sourceCode);

        setComponents(comp);

      });
    }

  }, []);

  const getSourceCode = async () => {
    const endpoint = `http://localhost:8000/api/v1/websites/website/:${websiteId}`;
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      const sourceCode = response.data.data.sourcecode;
     
      return sourceCode;
    } else {
      console.error("Failed to fetch source code");
      return null;
    }
  }


  const handleMenuAction = (action) => {
    if (action === "logout") {
      onLogout();
    } else if (action === "profile") {
      // Navigate to profile page
    } else if (action === "settings") {
      // Navigate to settings page
    }
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === "canvas") {
      // Find the component in the componentsList
      const draggedComponentTemplate = componentsList.find(
        (comp) => comp.id === active.id
      );

      if (draggedComponentTemplate) {
        // Create a new instance of the component
        const newComponent = {
          ...draggedComponentTemplate,
          style: { ...draggedComponentTemplate.style },
          children: draggedComponentTemplate.isContainer ? [] : undefined,
        };

        // Add to the components array
        setComponents((prevComponents) => [...prevComponents, newComponent]);
      }
    } else if (over.id.startsWith("droppable-")) {
      // Handle dropping into a nested container
      const draggedComponentTemplate = componentsList.find(
        (comp) => comp.id === active.id
      );

      if (draggedComponentTemplate) {
        // Find the target container
        const pathParts = over.id.replace("droppable-", "").split("-");
        let currentLevel = components;
        let targetContainer = null;
        const targetPath = [];

        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (part === "children") continue;

          const index = Number.parseInt(part);
          targetPath.push(index);

          if (i === pathParts.length - 1) {
            targetContainer = currentLevel[index];
          } else if (
            i < pathParts.length - 2 &&
            pathParts[i + 1] === "children"
          ) {
            currentLevel = currentLevel[index].children;
            targetPath.push("children");
          } else {
            currentLevel = currentLevel[index];
          }
        }

        if (targetContainer && targetContainer.isContainer) {
          // Create a new component instance
          const newComponent = {
            ...draggedComponentTemplate,
            style: { ...draggedComponentTemplate.style },
            children: draggedComponentTemplate.isContainer ? [] : undefined,
          };

          // Update the components state
          const updatedComponents = [...components];
          let current = updatedComponents;

          for (let i = 0; i < targetPath.length; i++) {
            if (targetPath[i] === "children") {
              continue;
            }
            if (i === targetPath.length - 1) {
              if (!current[targetPath[i]].children) {
                current[targetPath[i]].children = [];
              }
              current[targetPath[i]].children.push(newComponent);
            } else if (
              i < targetPath.length - 2 &&
              targetPath[i + 1] === "children"
            ) {
              current = current[targetPath[i]].children;
            } else {
              current = current[targetPath[i]];
            }
          }

          setComponents(updatedComponents);
        }
      }
    }
  };  const save = async () => {

    console.log("Saving components:", components);
    if (!userData) {
      alert("Please log in to save your work.");
      return;
    }

    try {
      if (websiteId === "new") {
        // Prompt user for website name
        const websiteName = prompt("Please enter a name for your website:", "");
        
        // If user cancels, abort the save operation
        if (websiteName === null) {
          return;
        }
        
        console.log(components);
        const endpoint = "http://localhost:8000/api/v1/websites/websites";
        const formData = new FormData();
        formData.append("sourcecode", JSON.stringify(components));
        formData.append("name", websiteName);
        const response = await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
            // Note: DO NOT set Content-Type manually — let Axios set it automatically
          },
          withCredentials: true, // 👈 sends cookies with request
        });

        console.log("Response:", response.data.data._id);
        if (response.status === 200) {
          alert("Page saved successfully!");
          navigate(`/editor/${response.data.data._id}`);
        } else {
          alert("Failed to save the page.");
        }
      }      else {
        const endpoint = `http://localhost:8000/api/v1/websites/updatewebsites/:${websiteId}`;
        
        const formData = new FormData();
        formData.append("sourcecode", JSON.stringify(components));
        // Keep original name for updates
        formData.append("name", "New Website");
        const response = await axios.patch(endpoint,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
            },
          }
        );
        console.log("Response:", response.data);
        if (response.status === 200) {
          alert("Page updated successfully!");
          
        } else {
          alert("Failed to update the page.");
        }
      }
    } catch (error) {
      alert("An error occurred while saving the page.");
      console.error("Error saving page:", error);
    }
  }

  return (
    <div>
      <Navigation userData={userData} onMenuAction={handleMenuAction} />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          <div className="w-1/5 p-4 border-r border-slate-200 overflow-y-auto bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4 text-slate-800 pb-2 border-b border-slate-200">
              Components
            </h2>
            <ComponentCategoryList categories={componentCategories} />
          </div>

          <Canvas
            components={components}
            setComponents={setComponents}
            setSelectedElement={setSelectedElement}
          />

          <RightPanel
            selectedElement={selectedElement}
            setComponents={setComponents}
            components={components}
          />

          <div className="fixed bottom-6 right-6 flex gap-3 z-10">
            <button
              onClick={() => {
                // Add save functionality here
                save();
                // Actual save implementation would go here
              }}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-lg cursor-pointer shadow-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
            >
              Save
            </button>

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

        <PreviewModal
          components={components}
          isOpen={isPreviewModalOpen}
          setIsOpen={setIsPreviewModalOpen}
        />

        <CodeExportModal
          components={components}
          isOpen={isCodeExportModalOpen}
          setIsOpen={setIsCodeExportModalOpen}
        />
      </DndContext>

    </div>
  );
}
