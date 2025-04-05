import { SyntheticEvent } from "react";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { Tab, TabProps, Tabs } from "@mui/material";
import { serviceModules } from "/src/plugins/service";
import { useSubscription } from "/src/plugins/action";
import { useCurrentServiceKey, useEnabledServiceKeys, useServicePropsList, useServiceStore } from "/src/store/service.ts";
import { loopGet } from "/src/util/array.ts";

interface ServiceSelectorProps {
  onChange?: (serviceKey: string) => void
}

const ServiceSelector = ({ onChange }: ServiceSelectorProps) => {
  const enabledServiceKeys = useEnabledServiceKeys()
  const currentServiceKey = useCurrentServiceKey()
  const setCurrentServiceKey = useServiceStore((state) => state.setCurrentServiceKey)
  const setServicePropsList = useServiceStore((state) => state.setServices)
  const servicePropsList = useServicePropsList()
  const handleServiceKeyChange = (_: SyntheticEvent, value: string) => {
    setCurrentServiceKey(value)
    onChange?.(value)
  }

  useSubscription({
    servicePrev: () => setCurrentServiceKey(loopGet(enabledServiceKeys, enabledServiceKeys.indexOf(currentServiceKey), -1)),
    serviceNext: () => setCurrentServiceKey(loopGet(enabledServiceKeys, enabledServiceKeys.indexOf(currentServiceKey), 1)),
  })

  // 处理拖拽
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const index = (id: UniqueIdentifier) => servicePropsList.findIndex(({ key }) => id === key)
    console.log(arrayMove(servicePropsList, index(active.id), index(over.id)))
    setServicePropsList(arrayMove(servicePropsList, index(active.id), index(over.id)))
  }

  const TabItem = (props: TabProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.value })
    return <Tab ref={setNodeRef} {...attributes} {...listeners} sx={{ transform: CSS.Transform.toString(transform), transition }} {...props} />
  }

  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
    <SortableContext items={enabledServiceKeys.map(id => ({ id }))} strategy={horizontalListSortingStrategy}>
      <Tabs value={currentServiceKey} variant="scrollable" scrollButtons="auto" onChange={handleServiceKeyChange}>
        {enabledServiceKeys.map(serviceKey =>
          <TabItem key={serviceKey} value={serviceKey} label={serviceModules[serviceKey].name} />
        )}
      </Tabs>
    </SortableContext>
  </DndContext>
}

export default ServiceSelector
