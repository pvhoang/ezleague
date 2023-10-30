<?php

namespace App\Rules\RemoveRule;

use App\Models\Location;
use App\Models\StageMatch;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Support\Facades\Log;
use PgSql\Lob;

class RemoveLocationRule implements Rule, DataAwareRule, ValidatorAwareRule
{
    /**
     * The data under validation.
     *
     * @var array
     */
    protected $data;

    /**
     * Additional validation rules that should be merged into the default rules during validation.
     *
     * @var array
     */
    protected $customRules = [];

    /**
     * The validator performing the validation.
     *
     * @var \Illuminate\Contracts\Validation\Validator
     */
    protected $validator;

    private Location $location;

    protected $messages = [];
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(Location $location)
    {
        $this->location = $location;
    }


    /**
     * Specify additional validation rules that should be merged with the default rules during validation.
     *
     * @param  string|array  $rules
     * @return $this
     */
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
            [$attribute => array_merge($this->customRules)],
            $this->validator->customMessages,
            $this->validator->customAttributes
        )->after(function ($validator) use ($attribute, $value) {
            if ($this->location) {
                // check if team_player is in match details
                $matches = StageMatch::with('tournament')->where('location_id', $this->location->id)->get();
                if ($matches->count() > 0) {
                    $tournament_names = $matches->pluck('tournament.name')->unique();
                    $validator->errors()->add($attribute, __('Cannot be deleted because this location is used in the following tournaments: <br/><b>:tournaments</b>', ['tournaments' => implode('<br/>', $tournament_names->toArray())]));
                }
            }
        });

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
