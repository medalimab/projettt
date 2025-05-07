<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RentalController extends Controller
{
    // Créer une location
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|string',
            'user' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed,cancelled',
        ]);

        $rental = Rental::create($validated);

        return response()->json($rental, 201);
    }

    // Lister toutes les locations
    public function index()
    {
        return response()->json(Rental::all());
    }

    // Voir une location spécifique
    public function show($id)
    {
        $rental = Rental::find($id);
        return $rental ? response()->json($rental) : response()->json(['error' => 'Not Found'], 404);
    }

    // Mettre à jour une location (ex. statut ou coût)
    public function update(Request $request, $id)
    {
        $rental = Rental::findOrFail($id);
        $rental->update($request->all());
        return response()->json($rental);
    }

    // Supprimer une location
    public function destroy($id)
    {
        Rental::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
