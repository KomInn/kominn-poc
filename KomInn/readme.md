# KomInn - Forslagsløsning for kommunale tiltak

## Kort funksjonell beskrivelse
KomInn er en løsning for SharePoint 2013 og SharePoint Online, bygget initielt for Asker kommune. Løsningen muliggjør innsendelse og behandling av innkommende forslag. 

## Teknisk beskrivelse
Løsningen er konstruert som en Single Page Application (SPA) med React. Løsningen er utviklet med hensyn til SharePoint Framework webparts, som kommer i en nær fremtid. På grunn av dette 
benyttes noe funksjonalitet utover standardfunksjonalitet. 

## Installasjon
Installasjonsprogrammet fungerer både på Office 365 og SharePoint 2013 On-premises. For utrulling må din bruker være global administrator og satt til administrator av termlageret.

## Installasjon på SharePoint 2013 on-premises
1. Installér [Workflow Manager](https://msdn.microsoft.com/en-us/library/jj193448.aspx) - Express setup 
2. Følg stegene på [Install and configure workflow for SharePoint Server 2013](https://technet.microsoft.com/en-us/library/jj658588.aspx)
3. [Sett opp ditt miljø for Apps](https://technet.microsoft.com/en-us/library/fp161236.aspx)
4. Deployment-brukeren må være site collection administrator.
5. Sett brukeren du skal provisjonere ut løsningen med som administrator for termlageret. 




