import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useContext,
} from 'react'
import { IconContext } from '../Icon/IconContext'
import { IconLoader } from '../Icon/icons/IconLoader'

import styleHandler from '../../lib/theme/styleHandler'

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean
  className?: any
  children?: React.ReactNode
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
  loadingCentered?: boolean
  shadow?: boolean
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
  style?: React.CSSProperties
  type?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'outline'
    | 'dashed'
    | 'link'
    | 'text'
  danger?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
  ref?: any
  ariaSelected?: boolean
  ariaControls?: string
  tabIndex?: 0 | -1
  role?: string
  as?: keyof JSX.IntrinsicElements
}

interface CustomButtonProps extends React.HTMLAttributes<HTMLOrSVGElement> {}

export interface RefHandle {
  container: () => HTMLElement | null
  button: () => HTMLButtonElement | null
}

const Button = forwardRef<RefHandle, ButtonProps>(
  (
    {
      block,
      className,
      children,
      danger,
      disabled = false,
      onClick,
      icon,
      iconRight,
      loading = false,
      loadingCentered = false,
      shadow = true,
      size = 'tiny',
      style,
      type = 'primary',
      htmlType,
      ariaSelected,
      ariaControls,
      tabIndex,
      role,
      as,
      ...props
    }: ButtonProps,
    ref
  ) => {
    // button ref
    const containerRef = useRef<HTMLElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useImperativeHandle(ref, () => ({
      container: () => {
        return containerRef.current
      },
      button: () => {
        return buttonRef.current
      },
    }))

    let __styles = styleHandler('button')

    // styles
    const showIcon = loading || icon

    let classes = [__styles.base]
    let containerClasses = [__styles.container]

    classes.push(__styles.type[type])

    if (block) {
      containerClasses.push(__styles.block)
      classes.push(__styles.block)
    }

    if (danger) {
      classes.push(__styles.danger[type])
    }

    if (shadow && type !== 'link' && type !== 'text') {
      classes.push(__styles.shadow)
    }

    if (size) {
      classes.push(__styles.size[size])
    }

    if (className) {
      classes.push(className)
    }

    if (disabled) {
      classes.push(__styles.disabled)
    }

    const iconLoaderClasses = [__styles.loading]

    // if (loadingCentered) {
    //   iconLoaderClasses.push(ButtonStyles[`sbui-btn-loader--center`])
    // }
    // if (loading && loadingCentered) {
    //   classes.push(ButtonStyles[`sbui-btn--text-fade-out`])
    // }

    // custom button tag
    const CustomButton: React.FC<CustomButtonProps> = ({ ...props }) => {
      const Tag = as as keyof JSX.IntrinsicElements
      return <Tag {...props} />
    }

    const RenderedButton = ({ children }: any) =>
      as ? (
        <CustomButton
          className={classes.join(' ')}
          onClick={onClick}
          style={style}
        >
          {children}
        </CustomButton>
      ) : (
        <button
          {...props}
          ref={buttonRef}
          className={classes.join(' ')}
          disabled={loading || (disabled && true)}
          onClick={onClick}
          style={style}
          type={htmlType}
          aria-selected={ariaSelected}
          aria-controls={ariaControls}
          tabIndex={tabIndex}
          role={role}
        >
          {children}
        </button>
      )

    return (
      <span ref={containerRef} className={containerClasses.join(' ')}>
        <RenderedButton>
          {showIcon &&
            (loading ? (
              <IconLoader size={size} className={iconLoaderClasses.join(' ')} />
            ) : icon ? (
              <IconContext.Provider value={{ contextSize: size }}>
                {icon}
              </IconContext.Provider>
            ) : null)}
          {children && <span>{children}</span>}
          {iconRight && !loading && (
            <IconContext.Provider value={{ contextSize: size }}>
              {iconRight}
            </IconContext.Provider>
          )}
        </RenderedButton>
      </span>
    )
  }
)

export default Button
