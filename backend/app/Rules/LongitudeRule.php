<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class LongitudeRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // the longitude must be between -180 and 180
        return preg_match('/^[-]?((1[0-7][0-9])|([0-9]?[0-9]))(\.\d+)?$/', $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return __('validation.longitude');
    }
}
