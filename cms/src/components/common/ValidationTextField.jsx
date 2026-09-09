import { Box, TextField } from "@mui/material";
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
    <Box>
      <TextField
        id={name}
        name={name}
        type={type}
        label={title}
        size={size}
        multiline={multiline}
        minRows={minRows}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        sx={validate ? {} : { input: { backgroundColor: "error" } }}
        error={!validate}
        helperText={!validate && errorText}
        fullWidth
        variant="outlined"
        onKeyDown={onKeyDown}
      />
    </Box>
  );
}
