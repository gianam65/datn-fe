import React, { useState, useEffect } from 'react'
import './radio-input.scss'
import { CHOICE_TO_LABEL } from '../../constants/constants'
import cn from 'classnames'

interface RadioInputProps {
  className?: string
  onRadioChange: (value: string) => void
  checkedValue: string
}

const RadioInput: React.FC<RadioInputProps> = ({
  className = '',
  onRadioChange,
  checkedValue,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    // Update the selected option when the checkedValue prop changes
    setSelectedOption(checkedValue)
  }, [checkedValue])

  const options = Array.from({ length: 4 }, (_, index) => index + 1)

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedOption(value)
    onRadioChange(value)
  }

  return (
    <div
      className={cn('radio__input-list', {
        [className]: className,
      })}
    >
      {options.map((option, idx) => (
        <label key={option} className="radio__input-item">
          <input
            type="radio"
            value={CHOICE_TO_LABEL[idx as keyof typeof CHOICE_TO_LABEL]}
            checked={
              selectedOption ===
              CHOICE_TO_LABEL[idx as keyof typeof CHOICE_TO_LABEL]
            }
            onChange={handleOptionChange}
          />
          {CHOICE_TO_LABEL[idx as keyof typeof CHOICE_TO_LABEL]}
        </label>
      ))}
    </div>
  )
}

export default RadioInput
