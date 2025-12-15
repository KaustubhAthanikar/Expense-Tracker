import React from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopUp from '../EmojiPickerPopUp'
import { useState } from 'react'

const AddExpenseForms = ({onAddExpense}) => {
    const [income, setIncome] = useState({
        category:"",
        amount:"",
        date:"",
        icon:""
    });

    const handleChange=(key,value)=> setIncome({...income,[key]:value});
  return (
    <div>
    <EmojiPickerPopUp
    icon={income.icon}
    onSelect={(selectedIcon)=>handleChange("icon", selectedIcon)}
    />

    <Input
        value={income.category}
        onChange={({target})=>handleChange("category",target.value)}
        label="Category"
        placeholder="Rent, Grocery,etc"
        type="text"
    />

    <Input
        value={income.amount}
        onChange={({target})=>handleChange("amount",target.value)}
        label="Amount"
        placeholder=""
        type="number"
    />

     <Input
        value={income.date}
        onChange={({target})=>handleChange("date",target.value)}
        label="Date"
        placeholder="Rent, Grocery,etc"
        type="date"
    />
      <div className='flex justify-end'>
        <button
            type="button"
            className='add-btn add-btn-fill'
            onClick={()=>onAddExpense(income)}
        >Add Expense</button>
      </div>
    </div>
  )
}

export default AddExpenseForms
