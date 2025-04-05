import { useState } from "react";
import { Box, Card, CardContent, Checkbox, Grid, InputAdornment, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { serviceModules } from "/src/plugins/service";
import { useServiceProps, useServiceStore } from "/src/store/service";
import { GppGoodOutlined, RepeatOneSharp, RepeatSharp, ShieldOutlined } from "@mui/icons-material";

interface ServiceItemProps {
  serviceKey: string
  serviceModule: ServiceModule
}

const ServiceItem = ({ serviceKey, serviceModule: { name, authProps } }: ServiceItemProps) => {
  const serviceProps = useServiceProps(serviceKey)
  const setServiceProps = useServiceStore(state => state.setService)
  if (!serviceProps) {
    return null
  }

  const updatePartial = (value: Partial<ServiceProps>) => setServiceProps(serviceKey, Object.assign({}, serviceProps, value))

  const [auth, setAuth] = useState<AuthData>(serviceProps.authData ?? {})
  const [limit, setLimit] = useState<number>(serviceProps.limit ?? 0)
  const [usage, setUsage] = useState<number>(serviceProps.usage ?? 0)

  return <Card variant="outlined" sx={{ m: 1 }}>
    <CardContent sx={{ '& .MuiTextField-root': { my: 1 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          {name}
        </Typography>
        <Switch checked={serviceProps.enable} onChange={e => updatePartial({ enable: e.target.checked })} />
      </Box>

      {authProps.map(([field, label, type]: AuthProp) => <TextField
        key={field}
        label={label}
        value={auth?.[field] ?? ""}
        type={type}
        variant="standard"
        fullWidth
        disabled={!serviceProps.enable}
        onChange={e => setAuth({ ...auth, [field]: e.target.value })}
        onBlur={() => updatePartial({ authData: auth })}
      />)}

      <Grid container spacing={1}>
        <Grid size={6}>
          <TextField label="限制字符数" value={limit} type="number" variant="standard" fullWidth
            onChange={e => setLimit(Number(e.target.value))} onBlur={() => updatePartial({ limit: limit })}
            disabled={!serviceProps.enable || !serviceProps.block}
            slotProps={{
              input: {
                startAdornment: <Tooltip title={serviceProps.block ? "字符超出时阻止请求" : "字符超出时什么都不做"}>
                  <Checkbox checked={serviceProps.block} icon={<ShieldOutlined />} checkedIcon={<GppGoodOutlined />}
                    onChange={e => updatePartial({ block: e.target.checked })}
                    disabled={!serviceProps.enable} />
                </Tooltip>,
                endAdornment: <InputAdornment position="end">字符</InputAdornment>,
              }
            }} />
        </Grid>
        <Grid size={6}>
          <TextField label="已用字符数" value={usage} type="number" variant="standard" fullWidth
            onChange={e => setUsage(Number(e.target.value))} onBlur={() => updatePartial({ usage: usage })}
            disabled={!serviceProps.enable}
            slotProps={{
              input: {
                startAdornment: <Tooltip title={serviceProps.reset ? "月初自动重置" : "保持使用字符数不变"}>
                  <Checkbox checked={serviceProps.reset} icon={<RepeatSharp />} checkedIcon={<RepeatOneSharp />}
                    onChange={e => updatePartial({ reset: e.target.checked })}
                    disabled={!serviceProps.enable} />
                </Tooltip>,
                endAdornment: <InputAdornment position="end">字符</InputAdornment>,
              }
            }} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
}

const ServiceSetting = () => {
  return <Box>
    {Object.entries(serviceModules).map(([serviceKey, serviceModule]) =>
      <ServiceItem key={serviceKey} serviceKey={serviceKey} serviceModule={serviceModule} />
    )}
  </Box>
}

export default ServiceSetting
