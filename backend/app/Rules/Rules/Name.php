<?php

namespace App\Rules\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Support\Facades\Log;

class Name implements Rule, DataAwareRule, ValidatorAwareRule
{
    /**
     * The data under validation.
     *
     * @var array
     */
    protected $data;
    protected $mixedCase = false;
    protected $customRules = [];

     /**
     * The callback that will generate the "default" version of the password rule.
     *
     * @var string|array|callable|null
     */
    public static $defaultCallback;
    
    /**
     * The validator performing the validation.
     *
     * @var \Illuminate\Contracts\Validation\Validator
     */
    protected $validator;

    private $min = 2;
    private $max = 50;
    // private $regex = '/^[a-zA-Z\x{3400}-\x{9fa5}\x{00C0}-\x{1EF9}\x{feff}\x{00A0}\x{202F}\x{FF0C}]+(([\'’,. -][a-z \x{3400}-\x{9fa5}\x{00C0}-\x{1EF9}\x{feff}\x{00A0}\x{202F}\x{FF0C}])?[a-z \x{3400}-\x{9fa5}\x{00C0}-\x{1EF9}\x{feff}\x{00A0}\x{202F}\x{FF0C}]*)*$/iu';
    private $regex = '/^\p{L}([.,\'’-]?\s?[\p{L}\p{M}]+)*[\p{L}\p{M}]*$/iu';
    protected $messages = [];
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    public static function min($size)
    {
        return new static($size);
    }

     /**
     *
     * @return static
     */
    public static function default()
    {
        $name = is_callable(static::$defaultCallback)
                            ? call_user_func(static::$defaultCallback)
                            : static::$defaultCallback;

        return $name instanceof Rule ? $name : static::min(5);
    }

     /**
     * Get the default configuration of the password rule and mark the field as required.
     *
     * @return array
     */
    public static function required()
    {
        return ['required', static::default()];
    }

    /**
     * Makes the password require at least one uppercase and one lowercase letter.
     *
     * @return $this
     */
    public function mixedCase()
    {
        $this->mixedCase = true;

        return $this;
    }

    public function rules($rules)
    {
        $this->customRules = Arr::wrap($rules);

        return $this;
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
        //

        $this->messages = [];
        $validator = Validator::make(
            $this->data,
            [$attribute => array_merge(['string', 'min:'.$this->min, 'max:'.$this->max], $this->customRules)],
            $this->validator->customMessages,
            $this->validator->customAttributes
        )
            ->after(
                function ($validator) use ($attribute, $value) {
                   $value = trim($value);
                   $value = preg_replace('/\s+/', ' ', $value);
                    if (!is_string($value)) {
                        return;
                    }
                    $value = (string) $value;
                    if (!preg_match($this->regex, $value)) {
                        Log::info('Name validation failed');
                        $validator->errors()->add($attribute, __('validation.name_invalid'));
                    }
                }
            );

        if ($validator->fails()) {
            return $this->fail($validator->messages()->all());
        }

        return true;
    }

    /**
     * Set the data under validation.
     *
     * @param  array  $data
     * @return $this
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Set the performing validator.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return $this
     */
    public function setValidator($validator)
    {
        $this->validator = $validator;

        return $this;
    }

    /**
     * Get the validation error message.
     *
     * @return array
     */
    public function message()
    {
        return $this->messages;
    }

    /**
     * Adds the given failures, and return false.
     *
     * @param  array|string  $messages
     * @return bool
     */
    protected function fail($messages)
    {
        $messages = collect(Arr::wrap($messages))->map(function ($message) {
            return $this->validator->getTranslator()->get($message);
        })->all();

        $this->messages = array_merge($this->messages, $messages);

        return false;
    }
}
