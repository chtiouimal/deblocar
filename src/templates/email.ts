// export function clientEmailTemplate(data: any) {
//   console.log("email data: ", data);
//   return `
// Bonjour ${data.name},

// Merci pour votre demande de devis sur le site Deblocar.
// Nous avons bien reçu les informations concernant votre véhicule :

// Marque : ${data.brand}
// Année : ${data.year}
// ${
//   data.vin
//     ? `Numéro de châssis : ${data.vin}`
//     : data.mPoste
//       ? `Modèle de poste : ${data.mPoste}`
//       : `Informations véhicule : Non renseigné`
// }
// Service demandé : ${data.services}

// Notre équipe va vérifier la faisabilité de l’intervention selon le modèle de votre véhicule et les options disponibles.

// Si l’intervention est possible, nous vous enverrons rapidement :
// ● le tarif exact,
// ● les délais d’intervention,
// ● les possibilités de rendez-vous,
// ● et les détails du service.

// Chez Deblocar, chaque demande est vérifiée avant confirmation afin de vous proposer une intervention adaptée et fiable.

// Pour toute information complémentaire, vous pouvez nous contacter directement par téléphone ou WhatsApp au +216 00 000 000.

// Cordialement,
// L’équipe Deblocar
// https://your-link.com
// `;
// }

export function clientEmailTemplate(data: any) {
  const vehicleInfo = data.vin
    ? `<strong>Numéro de châssis :</strong> ${data.vin}`
    : data.mPoste
      ? `<strong>Modèle de poste :</strong> ${data.mPoste}`
      : `<strong>Informations véhicule :</strong> Non renseignées`;
  const services = Array.isArray(data.services)
    ? data.services.join(", ")
    : data.services || "Non renseigné";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Demande reçue</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#222;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

<tr>
<td align="center" style="padding:40px 20px 20px;">
<img
src="https://deblocar.com/deblocar-logo.png"
alt="Deblocar"
width="180"
/>
</td>
</tr>

<tr>
<td style="padding:0 40px 40px;line-height:1.7;font-size:15px;">

<h2 style="margin-top:0;color:#DC1F26;">
Merci pour votre demande, ${data.name} !
</h2>

<p>
Nous avons bien reçu les informations concernant votre véhicule.
</p>

<div style="background:#f7f7f7;padding:20px;border-radius:8px;margin:24px 0;">
<p><strong>Marque :</strong> ${data.brand}</p>
<p><strong>Année :</strong> ${data.year}</p>
<p>${vehicleInfo}</p>
<p><strong>Services demandés :</strong> ${data.services}</p>
</div>

<p>
Notre équipe va vérifier la faisabilité de l'activation demandée et reviendra vers vous rapidement avec :
</p>

<ul>
<li>Les options disponibles</li>
<li>Le tarif correspondant</li>
<li>Les prochaines disponibilités pour un rendez-vous</li>
</ul>

<p>
Si des informations complémentaires sont nécessaires, notre équipe vous contactera directement par téléphone ou WhatsApp.
</p>

<p>
Merci pour votre confiance.
</p>

<p style="margin-top:32px;">
<strong>L'équipe Deblocar</strong>
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #e5e5e5;" />


    <div style="padding-right:16px;padding-bottom:20px;vertical-align:top;">
      <a href="https://deblocar.com" target="_blank">
        <img
          src="https://deblocar.com/deblocar-logo.png"
          alt="Deblocar"
          width="80"
          style="display:block;border:0;"
        />
      </a>
    </div>
<strong>Deblocar</strong><br/>
Activation d'options cachées pour véhicules<br/>
Téléphone : +216 XX XXX XXX<br/>

<div style="margin-top:20px;font-size:14px;line-height:2;">

Site web: <a
href="https://deblocar.com"
style="color:#DC1F26;text-decoration:none;margin-right:14px"
>
https://deblocar.com
</a><br />


Instagram: <a href="https://instagram.com/deblocar" style="margin-right:14px">
https://instagram.com/deblocar
</a><br />


Facebook: <a href=" https://www.facebook.com/profile.php?id=61587995278933">
https://facebook.com/deblocar
</a><br />

</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}
