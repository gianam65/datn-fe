import React, { useState } from 'react'
import './radio-input.scss'
import { CHOICE_TO_LABEL } from '../../constants/constants'
import cn from 'classnames'

interface RadioInputProps {
  numberOfOptions: number
  className?: string
}

const RadioInput: React.FC<RadioInputProps> = ({
  numberOfOptions,
  className = '',
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const options = Array.from(
    { length: numberOfOptions },
    (_, index) => index + 1,
  )

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value))
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
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
          />
          {CHOICE_TO_LABEL[idx as keyof typeof CHOICE_TO_LABEL]}
        </label>
      ))}
    </div>
  )
}

export default RadioInput
