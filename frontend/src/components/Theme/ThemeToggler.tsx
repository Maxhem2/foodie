import { FormLabel, Switch, SwitchProps, useColorMode } from "@chakra-ui/react";

type ThemeTogglerProps = {
  showLabel: boolean,
} & SwitchProps

export const ThemeToggler = (props: ThemeTogglerProps) => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <>
      {props.showLabel && (
        <FormLabel htmlFor="theme-toggler" mb={0}>
          Enable Dark Theme
        </FormLabel>
      )}
      <Switch
        id="theme-toggler"
        size="sm"
        isChecked={colorMode === "dark"}
        isDisabled={false}
        value={colorMode}
        colorScheme="orange"
        mr={2}
        onChange={toggleColorMode}
        {...props}
      />
    </>
  );
};
