import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import { models } from '../models/models'

export default function ModelSelector({ value, onChange }) {

    return (
        <FormControl>

            <Select name="model" defaultValue={value ?? "gpt-4"} onChange={(event, values) => {
                const name = "model";
                onChange({ target: { name, value: values } });
            }}>
                {models.map((model) => (
                    <Option key={model.code} value={model.code}>
                        {model.label}
                    </Option>
                ))}
            </Select>

        </FormControl>
    );
}

