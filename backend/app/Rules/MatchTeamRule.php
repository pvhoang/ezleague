<?php

namespace App\Rules;

use App\Models\StageMatch;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Support\Facades\Log;
use PgSql\Lob;

class MatchTeamRule implements Rule, DataAwareRule, ValidatorAwareRule
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

    private $match = null;
    private $data_arr = null;

    protected $messages = [];
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($match, $data_arr)
    {
        //
        $this->match = $match;
        $this->data_arr = $data_arr;
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
            // if type is knockout
            switch ($this->match->stage->type) {
                case config('constants.tournament_types.knockout'):
                    $no_encounters = $this->match->stage->no_encounters;
                    // $round_level = explode('-', $this->match['round_level'])[0];
                    $level = $this->match['round_level'];
                    $round = intval($level / 100);
                    $team_ids = [$value];
                    $check_duplicate_team = StageMatch::where('stage_id', $this->match->stage_id)
                        //    where round_level like 1-1 or 1-2 or 1-3 or 1-4
                        ->where('round_level', 'like', $round . '%')
                        ->where(function ($query) use ($team_ids) {
                            $query->whereIn('home_team_id', $team_ids)
                                ->orWhereIn('away_team_id', $team_ids);
                        })
                        ->where('id', '!=', $this->match->id)
                        ->count();
                    if ($check_duplicate_team >= $no_encounters) {
                        $validator->errors()->add($attribute, __('Duplicate team in this round'));
                    }
                    break;
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
