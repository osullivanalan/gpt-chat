import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import { models } from '../models/models'

export default function ModelSelector({value, onChange}) {

    return (
        <FormControl>

            <Select defaultValue={value?? "gpt-4"} onChange={onChange}>
                {models.map((model) => (
                    <Option  key={model.code} value={model.code}>
                        {model.label}
                    </Option>
                ))}
            </Select>

        </FormControl>
    );
}

