<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Team Sheet - {{ $season->name }} - {{ $group->name }} - {{ $team->name }} ({{ date('Y-M-d') }})</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <style>
        table#players {
            padding: 0px !important;
        }
        table#players td {
            border: 1px solid #dee2e6 !important;
            padding: 2px;
        }
    </style>
</head>

<body>

    <table width="100%" height="80px"><br>
        <tbody style="font-family: sans-serif">
            <tr>
                <td width="80px" class="text-left m-0 p-0">
                    <img src="{{ public_path('images/logo/logo.png') }}" width="80px">
                </td>
                <td width="250px">
                    <b class="text-uppercase" style="font-size: 16px">
                        {{ $app_name }} {{ $season->name }}
                    </b>
                    <br> Submitted: {{ date('Y-M-d') }}
                </td>
                <td width="250px" style="font-size: 14px">
                    <b>Club:</b> {{ $club->name }} ({{ $club->code }})
                    <br>
                    <b>Group:</b> {{ $group->name }}
                    <br>
                    <b>Team:</b> {{ $team->name }}
                </td>
                <td width="80px" class="text-right m-0 p-0">
                    <img src="{{ $club->logo }}" width="80px">
                </td>
            </tr>
        </tbody>
    </table>
    <hr>
    {{-- <h2 class="text-center mb-3">{{ $team->name }}</h2> --}}
    <table id="players" class="table table-bordered mt-3 mb-5" style="border: 0px">
        <tbody>

            @foreach ($team_players ?? '' as $data)
                {{--  if index  divisible by 4 then start new row --}}
                @if ($loop->index % 4 == 0)
                    <tr>
                @endif
                <td class="text-center" style="width: 25%;border: 1px">
                    <div class="border-column">
                        <img class="mt-1" style="margin:0 auto" src="{{ $data->player->photo }}" width="80px">
                        <div class=" text-center" style="font-family: heiti;font-size:15px;font-weight: bolder">
                            {{ $data->player->user->first_name }} {{ $data->player->user->last_name }}
                            <br>
                            {{ date('Y', strtotime($data->player->dob)) }}
                        </div>
                    </div>
                </td>
                {{--  if index  divisible by 4 then end row --}}
                @if ($loop->index % 4 == 3)
                    </tr>
                @endif
                {{-- if length of team_players not divisible by 4 then add empty td --}}
                @if ($loop->last && $loop->index % 4 != 3)
                    @for ($i = 0; $i < 4 - ($loop->index % 4) - 1; $i++)
                        <td class="text-center" style="width: 25%;border: 0px"></td>
                    @endfor
                    </tr>
                @endif
                
            @endforeach

        </tbody>
    </table>

</body>

</html>
