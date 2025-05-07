<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = [
        'car_id',
        'user',
        'start_date',
        'end_date',
        'status',
        'total_cost'
    ];
}
