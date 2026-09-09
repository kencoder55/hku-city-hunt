import palette from "@/styles/theme/palette";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function ValidationTextField({
  name,
  type,
  title,
  errorText,
  disabled,
  onChange,
  onBlur,
  touched,
  onKeyDown,
  size,
  required,
  multiline,
  minRows,
  value,
  placeholder,
  endAdornment,
}) {
  const [validate, setValidate] = useState(true);

  useEffect(() => {
    if (errorText && touched) {
      setValidate(false);
    } else {
      setValidate(true);
    }
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Typography color={palette.text.secondary}>
        {title} {required && "*"}
      </Typography>
      <TextField
        id={name}
        name={name}
        type={type}
        size={size}
        multiline={multiline}
        minRows={minRows}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        sx={validate ? {} : { input: { backgroundColor: "error" } }}
        error={!validate}
        helperText={!validate && errorText}
        fullWidth
        variant="outlined"
        onKeyDown={onKeyDown}
        slotProps={endAdornment ? { input: { endAdornment } } : undefined}
      />
    </Box>
  );
}
