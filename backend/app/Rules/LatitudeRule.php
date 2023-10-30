<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class LatitudeRule implements Rule
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
        // the latitude must be between -90 and 90
        return preg_match('/^[-]?(([0-8]?[0-9])|90)(\.\d+)?$/', $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return __('validation.latitude');
    }
}
