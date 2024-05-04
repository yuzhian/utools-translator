import { useRecoilState } from "recoil";
import { Box, Chip, Tooltip } from "@mui/material";
import { recordsState } from "/src/store/record.ts";

const TOOLTIP_DELAY = 500

interface RecordsPanelProps {
  onClick?: (value: string) => void
}

const RecordsPanel = ({ onClick }: RecordsPanelProps) => {
  const [records, setRecords] = useRecoilState(recordsState)
  const handleDelete = (index: number) => setRecords((prevRecords) => prevRecords.filter((_, i) => i !== index))
  return <Box maxWidth="calc(100vw - 32px)">
    {records.map((record, index) => (
      <Tooltip key={index} title={record} arrow enterDelay={TOOLTIP_DELAY} enterNextDelay={TOOLTIP_DELAY}
        componentsProps={{ tooltip: { sx: { maxWidth: "80vw", maxHeight: "5em", overflowY: "auto" } } }}>
        <Chip label={record} sx={{ height: "auto", m: 1, p: 1, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}
          onClick={() => onClick?.(record)} onDelete={() => handleDelete(index)} />
      </Tooltip>
    ))}
  </Box>
}

export default RecordsPanel
