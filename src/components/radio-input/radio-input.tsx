import React, { useState } from 'react'
import './radio-input.scss'
import { CHOICE_TO_LABEL } from '../../constants/constants'
import cn from 'classnames'

interface RadioInputProps {
  className?: string
  onRadioChange: (value: string) => void
}

const RadioInput: React.FC<RadioInputProps> = ({
  className = '',
  onRadioChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

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
