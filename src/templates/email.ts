export function clientEmailTemplate(data: any) {
  return `
Bonjour ${data.name},

Merci pour votre demande de devis sur le site Deblocar.
Nous avons bien reçu les informations concernant votre véhicule :

Marque : ${data.brand}
Année : ${data.year}
Numéro de châssis : ${data.vin}
Service demandé : ${data.services}

Notre équipe va vérifier la faisabilité de l’intervention selon le modèle de votre véhicule et les options disponibles.

Si l’intervention est possible, nous vous enverrons rapidement :
● le tarif exact,
● les délais d’intervention,
● les possibilités de rendez-vous,
● et les détails du service.

Chez Deblocar, chaque demande est vérifiée avant confirmation afin de vous proposer une intervention adaptée et fiable.

Pour toute information complémentaire, vous pouvez nous contacter directement par téléphone ou WhatsApp au +216 00 000 000.

Cordialement,
L’équipe Deblocar
https://your-link.com
`;
}
