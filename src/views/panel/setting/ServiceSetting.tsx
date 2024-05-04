import { ChangeEvent, useState } from "react";
import { useRecoilState } from "recoil";
import { cloneDeep, isEqual } from "lodash";
import { Button, Card, CardContent, CardHeader, List, ListItem, Switch, TextField } from "@mui/material";
import { serviceModules } from "/src/plugins/service";
import { servicePropsListState } from "/src/store/service";


interface ServiceItemProps {
  formItem: ServiceProps
  onChange: (value: ServiceProps) => void
}

const ServicePropsCard = ({ formItem, onChange }: ServiceItemProps) => {
  const service = serviceModules[formItem.key]

  const [nextAuthData, setNextAuthData] = useState(formItem.authData)
  const originalAuthData = cloneDeep(formItem.authData)

  const handleChange = (value: Partial<ServiceProps>) => onChange(Object.assign({}, formItem, value))
  const handleInputChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setNextAuthData({ ...nextAuthData, [field]: e.target.value })
  }
  const handleResetAuthData = () => {
    handleChange({ authData: originalAuthData })
    setNextAuthData(originalAuthData)
  }

  return <ListItem>
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardHeader title={service.name} titleTypographyProps={{ variant: "subtitle1" }} action={
        <Switch onClick={e => e.stopPropagation()} checked={formItem.enable}
          onChange={e => handleChange({ enable: e.target.checked })} />
      } />
      <CardContent>
        {service.authProps.map(([field, label, type]: AuthProp) => (
          <TextField
            key={field}
            value={nextAuthData?.[field] ?? ""}
            label={label}
            type={type}
            variant="standard"
            autoComplete="off"
            sx={{ mx: 1, width: "20em" }}
            onChange={handleInputChange(field)}
            onBlur={() => handleChange({ authData: nextAuthData })}
          />
        ))}
        {originalAuthData && !isEqual(nextAuthData, originalAuthData) && <Button onClick={handleResetAuthData}>撤销</Button>}
      </CardContent>
    </Card>
  </ListItem>
}

const ServiceSetting = () => {
  const [servicePropsList, setServicePropsList] = useRecoilState(servicePropsListState)
  const handleChange = (index: number) => (newValue: ServiceProps) =>
    setServicePropsList(preFormList => [...preFormList.slice(0, index), newValue, ...preFormList.slice(index + 1)])

  return <List>
    {servicePropsList.map((formItem, index) => (
      <ServicePropsCard key={formItem.key} formItem={formItem} onChange={handleChange(index)} />
    ))}
  </List>
}

export default ServiceSetting
