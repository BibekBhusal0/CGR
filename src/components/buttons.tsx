import { Button, ButtonProps, ButtonGroup, Tooltip } from "@heroui/react";
import { cn } from "@heroui/react";
import { Fragment } from "react/jsx-runtime";
import { ReactNode, Ref } from "react";

export interface newButtonProps extends Partial<ButtonProps> {
  icon?: ReactNode;
  hide?: boolean;
  children?: ReactNode;
  tooltip?: ReactNode;
}
export interface buttonsProps {
  buttons: newButtonProps[];
  defaultProps?: ButtonProps;
  includeSeperators?: boolean;
}
interface onlyButtonProp {
  ref?: Ref<HTMLButtonElement>;
}

export function Buttons({ defaultProps, buttons, includeSeperators }: buttonsProps) {
  return (
    <>
      {buttons.map((button, i) => {
        const OnlyButton = function ({ ref }: onlyButtonProp) {
          return (
            <Button
              {...defaultProps}
              {...button}
              ref={ref}
              className={cn(button?.className, defaultProps?.className)}>
              {includeSeperators && i !== 0 && <ButtonGroup.Separator />}
              {button.icon ? (
                <>
                  {button.icon} {button.children}
                </>
              ) : (
                button.children
              )}
            </Button>
          );
        };
        return (
          <Fragment key={i}>
            {!button.hide && (
              <>
                {!!button.tooltip ? (
                  <Tooltip>
                    <OnlyButton />
                    <Tooltip.Content>
                      <Tooltip.Arrow />
                      {button.tooltip}
                    </Tooltip.Content>
                  </Tooltip>
                ) : (
                  <OnlyButton />
                )}
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
