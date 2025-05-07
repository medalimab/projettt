<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use RdKafka\Consumer;
use RdKafka\Message;
use App\Models\Rental;
use Illuminate\Support\Facades\Log;

class ConsumeKafkaMessages extends Command
{
    protected $signature = 'kafka:consume';
    protected $description = 'Consomme les messages du topic Kafka';

    public function handle()
    {
        $conf = new \RdKafka\Conf();
        $conf->set('group.id', 'laravel-consumer-group-test');
        $conf->set('metadata.broker.list', 'kafka:9092');

        $consumer = new Consumer($conf);
        $topic = $consumer->newTopic('car-updates');

        $topic->consumeStart(0, RD_KAFKA_OFFSET_BEGINNING);

        $maxAttempts = 20; // Nombre maximum de tentatives sans message
        $attempts = 0;

        while ($attempts < $maxAttempts) {
            $message = $topic->consume(0, 1000);
            if ($message === null) {
                $this->error('Aucun message consommé ou erreur inconnue.');
                $attempts++;
                continue;
            }
            if ($message->err) {
                if ($message->err == RD_KAFKA_RESP_ERR__PARTITION_EOF) {
                    $attempts++;
                    continue;
                }
                $this->error($message->errstr());
                break;
            }

            $this->info('Message consommé : ' . $message->payload);

            // Ajout de logs pour capturer les messages consommés
            Log::info('Message consommé depuis Kafka : ', [
                'payload' => json_encode($message)
            ]);

            $attempts = 0; // Réinitialiser le compteur si un message est consommé

            // Décoder le message JSON
            $data = json_decode($message->payload, true);
            if (isset($data['car_id'], $data['available'])) {
                // Mapper les valeurs 'available' à des statuts textuels
                $status = $data['available'] ? 'active' : 'cancelled';

                // Mettre à jour le statut dans la base de données
                // Assurez-vous que car_id est traité comme une chaîne de caractères
                $updated = Rental::where('car_id', (string) $data['car_id'])->update(['status' => $status]);

                if ($updated) {
                    $this->info('Statut mis à jour pour car_id ' . $data['car_id'] . ' avec le statut ' . $status);
                } else {
                    $this->error('Aucune location trouvée pour car_id ' . $data['car_id']);
                }
            } else {
                $this->error('Message mal formé : ' . $message->payload);
            }
        }

        $this->info('Fin de la consommation après ' . $maxAttempts . ' tentatives sans message.');
    }
}