import { Box, Chip, Tooltip } from "@mui/material";
import { useRecordStore } from "/src/store/record.ts";

const TOOLTIP_DELAY = 500

interface RecordsPanelProps {
  onClick?: (value: string) => void
}

const RecordsPanel = ({ onClick }: RecordsPanelProps) => {
  const records = useRecordStore((state) => state.records)
  const removeRecord = useRecordStore((state) => state.removeRecord)


  return <Box maxWidth="calc(100vw - 32px)">
    {records.map((record, index) => (
      <Tooltip key={index} title={record} arrow enterDelay={TOOLTIP_DELAY} enterNextDelay={TOOLTIP_DELAY}
        slotProps={{ tooltip: { sx: { maxWidth: "80vw", maxHeight: "5em", overflowY: "auto" } } }}>
        <Chip label={record} sx={{ height: "auto", m: 1, p: 1, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}
          onClick={() => onClick?.(record)} onDelete={() => removeRecord(index)} />
      </Tooltip>
    ))}
  </Box>
}

export default RecordsPanel
