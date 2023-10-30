<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EndTimeAfterStartTime implements Rule
{
    protected $start_time;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($start_time)
    {
        $this->start_time = $start_time;
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
        $startTime = $this->start_time;
        $endTime = $value;
        return strtotime($endTime) > strtotime($startTime);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        // return message support localization
        return __('validation.end_time_after_start_time');
    }
}
