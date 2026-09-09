import { Box, MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ValidationSelect({
  name,
  required,
  value,
  onChange,
  onBlur,
  title,
  errorText,
  touched,
  onKeyDown,
  disabled,
  options,
  module,
}) {
  const t = useTranslations();
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
        select
        id={name}
        name={title}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={title}
        required={required}
        disabled={disabled}
        fullWidth
        helperText={validate ? "" : errorText}
        error={!validate}
        onKeyDown={onKeyDown}
      >
        {options.map(option => (
          <MenuItem key={option.key} value={option.value}>
            {t(`${module}.${name}_${option.value}`)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
