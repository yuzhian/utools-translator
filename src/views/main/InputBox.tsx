import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { FormHelperText, TextField, TextFieldProps } from "@mui/material";
import { useSubscription } from "/src/plugins/action";
import { extractComment } from "/src/util/text.ts";

interface InputBoxProps extends Omit<TextFieldProps, "onChange"> {
  value: string
  limit?: number
  wait?: number
  onChange?: (text: string) => void
  onDebounced?: (text: string) => void
}

const InputBox = ({ value, limit = 1000, wait = 550, onChange, onDebounced, ...props }: InputBoxProps) => {
  const debounced = useRef(debounce((f: () => void) => f(), wait))
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (value: string = "") => {
    onChange?.(value)
    debounced.current?.(() => onDebounced?.(value))
    inputRef.current?.focus()
  }

  // 加载时将焦点置于输入框
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 修改延迟时间时, 重置防抖
  useEffect(() => {
    debounced.current = debounce((f: () => void) => f(), wait)
    return () => debounced.current?.cancel()
  }, [wait])

  useSubscription({
    srcInputFocus: () => inputRef.current?.focus(),
    srcTextFromClipboard: () => navigator.clipboard.readText().then(handleChange),
    srcTextSentenceCase: () => handleChange(value.replace(/([a-z])([A-Z])|[_-]/g, "$1 $2").toLowerCase()),
    srcTextExtractComment: () => handleChange(extractComment(value))
  })

  return <>
    <TextField {...props} inputRef={inputRef} value={value} slotProps={{ htmlInput: { maxLength: limit } }} onChange={event => handleChange(event.target.value)} />
    <FormHelperText sx={{ textAlign: "right" }}>{value?.length.toLocaleString()} / {limit.toLocaleString()}</FormHelperText>
  </>
}

export default InputBox
