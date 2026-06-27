import { Button, ButtonProps, ButtonGroup } from "@heroui/react";
import { cn } from "@heroui/react";
import { Fragment } from "react/jsx-runtime";
import { ReactNode } from "react";

export interface newButtonProps extends Partial<ButtonProps> {
  icon?: ReactNode;
  hide?: boolean;
  children?: ReactNode;
}
export interface buttonsProps {
  buttons: newButtonProps[];
  defaultProps?: ButtonProps;
  includeSeperators?: boolean;
}

export function Buttons({ defaultProps, buttons, includeSeperators }: buttonsProps) {
  return (
    <>
      {buttons.map((button, i) => (
        <Fragment key={i}>
          {!button.hide && (
            <Button
              {...defaultProps}
              {...button}
              className={cn(button?.className, defaultProps?.className)}>
              {includeSeperators && i !== 0 && (
                <ButtonGroup.Separator />
              )}
              {button.icon ? (
                <>
                  {button.icon} {button.children}
                </>
              ) : (
                button.children
              )}
            </Button>
          )}
        </Fragment>
      ))}
    </>
  );
}
