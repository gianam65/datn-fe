import React from 'react'
import { Input, Tooltip } from 'antd'
import cn from 'classnames'

interface NumericInputProps {
  className?: string
  value: number | string
  onChange: (value: number) => void
  placeholder?: string
  maxValueEnabled?: boolean
}

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  maxValueEnabled = false,
  ...props
}) => {
  const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target

    const numericValue = inputValue.replace(/[^0-9.]/g, '')

    const cleanedValue = numericValue
      .replace(/(\..*?)\./g, '$1')
      .replace(/^0+(?=\d)/, '')
    let numericValueAsNumber = parseFloat(cleanedValue)

    if (maxValueEnabled) {
      numericValueAsNumber = Math.min(10, numericValueAsNumber)
    }

    onChange(isNaN(numericValueAsNumber) ? 0 : numericValueAsNumber)
  }

  const handleBlur = () => {
    let valueTemp = value.toString()
    if (valueTemp.charAt(valueTemp.length - 1) === '.' || valueTemp === '-') {
      valueTemp = valueTemp.slice(0, -1)
    }
    const numericValueAsNumber = parseFloat(valueTemp)
    onChange(isNaN(numericValueAsNumber) ? 0 : numericValueAsNumber)
  }

  const title = value ? (
    <span className="numeric-input-title">
      {value !== '-' ? formatNumber(Number(value)) : '-'}
    </span>
  ) : (
    placeholder || ''
  )

  return (
    <Tooltip
      trigger={['focus']}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
      className={cn({
        [className]: className,
      })}
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || ''}
        maxLength={3}
        value={value}
      />
    </Tooltip>
  )
}

export default NumericInput
