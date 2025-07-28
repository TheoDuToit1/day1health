import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface SubCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
  isExpanded: boolean;
  isIncluded: boolean;
}

const initialCategories: Category[] = [
  {
    id: 'medical',
    name: 'Medical Cover',
    description: 'Essential healthcare services and consultations',
    isExpanded: false,
    isIncluded: true,
    subCategories: [
      {
        id: 'medical-basic',
        name: 'Basic Cover',
        description: 'GP visits, basic tests, and essential procedures',
        price: 349,
        selected: true
      },
      {
        id: 'medical-comprehensive',
        name: 'Comprehensive',
        description: 'Includes specialist consultations and advanced diagnostics',
        price: 549,
        selected: false
      },
      {
        id: 'medical-premium',
        name: 'Premium',
        description: 'Full medical cover with private hospital access',
        price: 899,
        selected: false
      }
    ]
  },
  {
    id: 'medication',
    name: 'Chronic Medication',
    description: 'Coverage for ongoing medication needs',
    isExpanded: false,
    isIncluded: false,
    subCategories: [
      {
        id: 'medication-basic',
        name: 'Basic Formulary',
        description: 'Essential chronic medications',
        price: 199,
        selected: false
      },
      {
        id: 'medication-extended',
        name: 'Extended Formulary',
        description: 'Wider range of chronic medications',
        price: 349,
        selected: false
      },
      {
        id: 'medication-comprehensive',
        name: 'Comprehensive',
        description: 'Full chronic medication coverage',
        price: 499,
        selected: false
      }
    ]
  },
  {
    id: 'dental',
    name: 'Dental Care',
    description: 'Oral health and dental procedures',
    isExpanded: false,
    isIncluded: false,
    subCategories: [
      {
        id: 'dental-basic',
        name: 'Preventive',
        description: 'Check-ups, cleanings, and x-rays',
        price: 149,
        selected: false
      },
      {
        id: 'dental-comprehensive',
        name: 'Comprehensive',
        description: 'Includes fillings and extractions',
        price: 249,
        selected: false
      },
      {
        id: 'dental-premium',
        name: 'Premium',
        description: 'Includes crowns, bridges, and dentures',
        price: 399,
        selected: false
      }
    ]
  },
  {
    id: 'optical',
    name: 'Optical Care',
    description: 'Eye care and vision correction',
    isExpanded: false,
    isIncluded: false,
    subCategories: [
      {
        id: 'optical-basic',
        name: 'Basic',
        description: 'Eye tests and basic frames',
        price: 129,
        selected: false
      },
      {
        id: 'optical-premium',
        name: 'Premium',
        description: 'Includes designer frames and lenses',
        price: 299,
        selected: false
      }
    ]
  },
  {
    id: 'home-care',
    name: 'Home Care',
    description: 'In-home healthcare services',
    isExpanded: false,
    isIncluded: false,
    subCategories: [
      {
        id: 'home-nursing',
        name: 'Nursing Care',
        description: 'Basic nursing services at home',
        price: 299,
        selected: false
      },
      {
        id: 'home-support',
        name: 'Support Services',
        description: 'Includes personal care assistance',
        price: 499,
        selected: false
      }
    ]
  },
  {
    id: 'emergency',
    name: 'Emergency Response',
    description: '24/7 emergency assistance',
    isExpanded: false,
    isIncluded: false,
    subCategories: [
      {
        id: 'emergency-basic',
        name: 'Basic Alert',
        description: '24/7 emergency response',
        price: 179,
        selected: false
      },
      {
        id: 'emergency-premium',
        name: 'Premium Response',
        description: 'Includes GPS tracking and family notifications',
        price: 299,
        selected: false
      }
    ]
  }
];

const SeniorPackageBuilder: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [droppedCategories, setDroppedCategories] = useState<Category[]>([]);

  const calculateTotal = () => {
    return droppedCategories.reduce((total, category) => {
      const selectedSub = category.subCategories.find(sub => sub.selected);
      return selectedSub ? total + selectedSub.price : total;
    }, 0);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    // If dropped in the same position, toggle expansion
    if (sourceIndex === destIndex && result.source.droppableId === 'available-categories') {
      toggleCategoryExpansion(categories[sourceIndex].id);
      return;
    }

    // If dragged from available to selected
    if (result.source.droppableId === 'available-categories' && 
        result.destination.droppableId === 'selected-categories') {
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(sourceIndex, 1);
      movedCategory.isIncluded = true;
      
      if (movedCategory.subCategories.length > 0) {
        movedCategory.subCategories[0].selected = true;
      }
      
      setDroppedCategories([...droppedCategories, movedCategory]);
      setCategories(newCategories);
      return;
    }

    // If reordering in available categories
    if (result.source.droppableId === 'available-categories' && 
        result.destination.droppableId === 'available-categories') {
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(sourceIndex, 1);
      newCategories.splice(destIndex, 0, movedCategory);
      setCategories(newCategories);
      return;
    }

    // If reordering in selected categories
    if (result.source.droppableId === 'selected-categories' && 
        result.destination.droppableId === 'selected-categories') {
      const newDropped = [...droppedCategories];
      const [movedCategory] = newDropped.splice(sourceIndex, 1);
      newDropped.splice(destIndex, 0, movedCategory);
      setDroppedCategories(newDropped);
      return;
    }
    
    // If moving from selected back to available
    if (result.source.droppableId === 'selected-categories' && 
        result.destination.droppableId === 'available-categories') {
      const newDropped = [...droppedCategories];
      const [movedCategory] = newDropped.splice(sourceIndex, 1);
      movedCategory.isIncluded = false;
      movedCategory.isExpanded = false;
      movedCategory.subCategories.forEach(sub => sub.selected = false);
      
      const newCategories = [...categories];
      newCategories.splice(destIndex, 0, movedCategory);
      
      setCategories(newCategories);
      setDroppedCategories(newDropped);
      return;
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded } 
        : cat
    ));
    
    setDroppedCategories(droppedCategories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded } 
        : cat
    ));
  };

  const selectSubCategory = (categoryId: string, subCategoryId: string) => {
    const updateSubCategories = (subs: SubCategory[]) => 
      subs.map(sub => ({
        ...sub,
        selected: sub.id === subCategoryId
      }));

    setDroppedCategories(droppedCategories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, subCategories: updateSubCategories(cat.subCategories) } 
        : cat
    ));
  };

  const removeCategory = (categoryId: string) => {
    const categoryToRemove = droppedCategories.find(cat => cat.id === categoryId);
    if (!categoryToRemove) return;
    
    const updatedDropped = droppedCategories.filter(cat => cat.id !== categoryId);
    const updatedCategory = { 
      ...categoryToRemove, 
      isIncluded: false,
      isExpanded: false,
      subCategories: categoryToRemove.subCategories.map(sub => ({
        ...sub,
        selected: false
      }))
    };
    
    setDroppedCategories(updatedDropped);
    setCategories([...categories, updatedCategory]);
  };

  // Prevent text selection during drag
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = () => {
    setIsDragging(true);
    document.body.style.userSelect = 'none';
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    document.body.style.userSelect = '';
    onDragEnd(result);
  };

  return (
    <div className="space-y-8 select-none">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your ChoicePlan</h3>
        <p className="text-gray-600 mb-6">Choose the benefits you need. Skip what you don't. Build the cover that fits you.</p>
        
        <DragDropContext 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Available Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Available Categories</h4>
              <Droppable droppableId="available-categories">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="space-y-3 min-h-[200px] bg-gray-50 p-4 rounded-lg"
                  >
                    {categories.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>Drag categories here to remove them</p>
                      </div>
                    ) : (
                      categories.map((category, index) => (
                        <Draggable 
                          key={category.id} 
                          draggableId={`available-${category.id}`} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div 
                                className={`p-4 flex justify-between items-center cursor-grab active:cursor-grabbing hover:bg-gray-50 ${
                                  isDragging ? 'cursor-grabbing' : ''
                                }`}
                                onClick={() => {
                                  // Only toggle if not dragging
                                  if (!isDragging) {
                                    toggleCategoryExpansion(category.id);
                                  }
                                }}
                              >
                                <div>
                                  <h4 className="font-medium">{category.name}</h4>
                                  <p className="text-sm text-gray-500">{category.description}</p>
                                </div>
                                {category.isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              
                              {category.isExpanded && (
                                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t">
                                  <p className="text-sm text-gray-600 mb-3">Select one option:</p>
                                  <div className="space-y-2">
                                    {category.subCategories.map((sub) => (
                                      <div 
                                        key={sub.id}
                                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                                          sub.selected 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div className="font-medium">{sub.name}</div>
                                            <div className="text-sm text-gray-600">{sub.description}</div>
                                          </div>
                                          <div className="font-semibold text-gray-700 whitespace-nowrap ml-4">
                                            R{sub.price}/mo
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">How it works</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">Drag & Drop</h5>
                      <p className="text-sm text-gray-600">Drag categories to the right to include them in your package</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">Select Options</h5>
                      <p className="text-sm text-gray-600">Choose from available options in each category</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">See Your Price</h5>
                      <p className="text-sm text-gray-600">Your total updates automatically as you build</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Selected Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Your Package</h4>
              <Droppable droppableId="selected-categories">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="space-y-4 min-h-[200px]"
                  >
                    {droppedCategories.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Build Your Package</h4>
                        <p className="text-gray-600">Drag categories here to get started</p>
                      </div>
                    ) : (
                      <>
                        {droppedCategories.map((category, index) => {
                          const selectedSub = category.subCategories.find(sub => sub.selected);
                          return (
                            <Draggable 
                              key={category.id} 
                              draggableId={`selected-${category.id}`} 
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                                >
                                  <div 
                                    className="p-4 flex justify-between items-center"
                                    onClick={() => toggleCategoryExpansion(category.id)}
                                  >
                                    <div className="flex items-center">
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="mr-3 text-gray-400 hover:text-gray-600 cursor-move p-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                        </svg>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{category.name}</h4>
                                        {selectedSub && (
                                          <div className="text-sm text-gray-600">
                                            {selectedSub.name} • R{selectedSub.price}/mo
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeCategory(category.id);
                                        }}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                      {category.isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400 ml-2" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
                                      )}
                                    </div>
                                  </div>
                                  
                                  {category.isExpanded && (
                                    <div className="px-4 pb-4 pt-2 bg-gray-50 border-t">
                                      <p className="text-sm text-gray-600 mb-3">Select an option:</p>
                                      <div className="space-y-2">
                                        {category.subCategories.map((sub) => (
                                          <div 
                                            key={sub.id}
                                            className={`p-3 rounded-md border cursor-pointer transition-colors ${
                                              sub.selected 
                                                ? 'border-green-500 bg-green-50' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              selectSubCategory(category.id, sub.id);
                                            }}
                                          >
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <div className="font-medium">{sub.name}</div>
                                                <div className="text-sm text-gray-600">{sub.description}</div>
                                              </div>
                                              <div className="font-semibold text-gray-700 whitespace-nowrap ml-4">
                                                R{sub.price}/mo
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        
                        {droppedCategories.length > 0 && (
                          <div className="bg-gray-50 p-6 rounded-xl mt-6">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-lg font-semibold">Package Summary</h4>
                              <div className="text-2xl font-bold text-green-600">
                                R{calculateTotal()}<span className="text-base font-normal text-gray-500">/month</span>
                              </div>
                            </div>
                            
                            <div className="space-y-4 mb-6">
                              {droppedCategories.map(category => {
                                const selectedSub = category.subCategories.find(sub => sub.selected);
                                return selectedSub ? (
                                  <div key={category.id} className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">{category.name}</div>
                                      <div className="text-sm text-gray-600">{selectedSub.name}</div>
                                    </div>
                                    <div className="font-semibold">R{selectedSub.price}</div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                            
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                              Get This Package
                            </button>
                            
                            <p className="text-xs text-gray-500 mt-3 text-center">
                              Your selected benefits will be confirmed with a healthcare advisor
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold mb-1">Need help choosing?</h4>
            <p className="text-gray-600">Our senior care specialists can help you build the perfect package.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg whitespace-nowrap transition-colors">
            Speak to an Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeniorPackageBuilder;
