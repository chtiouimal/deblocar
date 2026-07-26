export function orderEmailTemplate(data: any) {
  const itemsHtml = data.items
    .map(
      (item: any) => `
        <div style="
          background:#f7f7f7;
          padding:20px;
          border-radius:8px;
          margin-bottom:16px;
        ">
          <p>
            <strong>Système :</strong> ${item.ntgName}
          </p>

          <p>
            <strong>Région :</strong> ${item.regionName || item.region}
          </p>

          <p>
            <strong>Version :</strong> ${item.versionName || item.version}
          </p>

          <p>
            <strong>VIN :</strong> ${item.vin}
          </p>

          <p>
            <strong>PIN :</strong>
            <span style="color:#DC1F26;font-weight:bold;">
              ${item.pin || "Échec de génération"}
            </span>
          </p>
        </div>
      `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Confirmation de commande</title>
</head>


<body style="
margin:0;
padding:0;
background:#f5f5f5;
font-family:Arial,Helvetica,sans-serif;
color:#222;
">


<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">


<table width="620" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
">


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
<td style="
padding:0 40px 40px;
line-height:1.7;
font-size:15px;
">


<h2 style="
margin-top:0;
color:#DC1F26;
">
Commande confirmée, ${data.name} !
</h2>


<p>
Merci pour votre commande sur Deblocar.
Vos codes PIN Mercedes-Benz ont été générés avec succès.
</p>


<div style="
background:#f7f7f7;
padding:20px;
border-radius:8px;
margin:24px 0;
">


<p>
<strong>Numéro de commande :</strong>
${data.orderId}
</p>


<p>
<strong>Nombre d'éléments :</strong>
${data.totalItems}
</p>


<p>
<strong>Tokens utilisés :</strong>
${data.totalTokens}
</p>


${
  data.balance !== null
    ? `<p><strong>Solde restant :</strong> ${data.balance} tokens</p>`
    : ""
}


</div>


<h3 style="color:#DC1F26;">
Détails de votre commande
</h3>


${itemsHtml}


<p>
Vous pouvez maintenant utiliser les codes PIN ci-dessus pour effectuer vos mises à jour Mercedes-Benz.
</p>


<p>
Si vous avez la moindre question concernant votre commande, notre équipe reste disponible.
</p>


<p style="margin-top:32px;">
<strong>L'équipe Deblocar</strong>
</p>



<hr style="
margin:40px 0;
border:none;
border-top:1px solid #e5e5e5;
" />


<div>

<img
src="https://deblocar.com/deblocar-logo.png"
alt="Deblocar"
width="80"
/>


<br/>

<strong>Deblocar</strong><br/>

Activation d'options cachées pour véhicules<br/>

Téléphone : +216 55 410 596


<div style="
margin-top:20px;
font-size:14px;
line-height:2;
">


Site web:
<a
href="https://deblocar.com"
style="
color:#DC1F26;
text-decoration:none;
">
https://deblocar.com
</a>

<br/>


Instagram:
<a
href="https://instagram.com/deblocar"
style="
color:#DC1F26;
text-decoration:none;
">
https://instagram.com/deblocar
</a>


<br/>


Facebook:
<a
href="https://www.facebook.com/profile.php?id=61587995278933"
style="
color:#DC1F26;
text-decoration:none;
">
https://facebook.com/deblocar
</a>


</div>

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
