import { useState } from "react";
import { useRecoilState } from "recoil";
import { Card, CardContent, CardHeader, Checkbox, List, ListItem, TextField } from "@mui/material";
import { serviceModules } from "/src/plugins/service";
import { servicePropsState } from "/src/store/service";

interface ServiceItemProps {
  serviceKey: string
  serviceModule: ServiceModule
}

const ServicePropsCard = ({ serviceKey, serviceModule: { name, authProps } }: ServiceItemProps) => {
  const [serviceProps, setServiceProps] = useRecoilState(servicePropsState(serviceKey))
  if (!serviceProps) {
    return null
  }
  const [tempAuthData, setTempAuthData] = useState<AuthData>(serviceProps.authData ?? {})
  const updatePartial = (value: Partial<ServiceProps>) => setServiceProps(Object.assign({}, serviceProps, value))

  return <ListItem>
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardHeader title={name} titleTypographyProps={{ variant: "subtitle1" }}
        action={<Checkbox checked={serviceProps.enable} onChange={e => updatePartial({ enable: e.target.checked })} />} />

      <CardContent>
        {/* 认证信息 */}
        {authProps.map(([field, label, type]: AuthProp) => <TextField
          key={field}
          value={tempAuthData?.[field] ?? ""}
          type={type}
          label={label}
          variant="standard"
          fullWidth
          disabled={!serviceProps.enable}
          onChange={e => setTempAuthData({ ...tempAuthData, [field]: e.target.value })}
          onBlur={() => updatePartial({ authData: tempAuthData })}
        />)}
      </CardContent>
    </Card>
  </ListItem>
}

const ServiceSetting = () => {
  return <List>
    {Object.entries(serviceModules).map(([serviceKey, serviceModule]) => (
      <ServicePropsCard key={serviceKey} serviceKey={serviceKey} serviceModule={serviceModule} />
    ))}
  </List>
}

export default ServiceSetting
