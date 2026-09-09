import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function ValidationAutocomplete({
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
  freeSolo,
  renderTags,
  placeholder
}) {
  const [validate, setValidate] = useState(true);
  const [finalOptions, setFinalOptions] = useState([]);

  useEffect(() => {
    if (errorText && touched) {
      setValidate(false);
    } else {
      setValidate(true);
    }
  });

  useEffect(() => {
    if (value.length <= 0) {
      setFinalOptions(options);
    } else {
      let filterIds = value.map((item) => item?.id);
      let filteredOptions = options.filter((item) => !filterIds.includes(item.id));
      setFinalOptions(filteredOptions);
    }
  }, [options, value]);

  return (
    <Box>
      <Autocomplete
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        options={finalOptions}
        multiple
        getOptionLabel={(option) => option?.name || ""}
        freeSolo={freeSolo}
        renderTags={renderTags ? renderTags : null}
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            required={required}
            disabled={disabled}
            onKeyDown={onKeyDown}
            sx={validate ? {} : { input: { backgroundColor: "error" } }}
            error={!validate}
            helperText={!validate && errorText}
            variant="outlined"
            placeholder={placeholder}
          />
        )}
      />
    </Box>
  );
}
