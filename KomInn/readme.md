# KomInn - Forslagsl�sning for kommunale tiltak

## Kort funksjonell beskrivelse
KomInn er en l�sning for SharePoint 2013 og SharePoint Online, bygget initielt for Asker kommune. L�sningen muliggj�r innsendelse og behandling av innkommende forslag. 

## Teknisk beskrivelse
L�sningen er konstruert som en Single Page Application (SPA) med React. L�sningen er utviklet med hensyn til SharePoint Framework webparts, som kommer i en n�r fremtid. P� grunn av dette 
benyttes noe funksjonalitet utover standardfunksjonalitet. 

## Installasjon
Installasjonsprogrammet fungerer b�de p� Office 365 og SharePoint 2013 On-premises. For utrulling m� din bruker v�re global administrator og satt til administrator av termlageret.

## Installasjon p� SharePoint 2013 on-premises
1. Install�r [Workflow Manager](https://msdn.microsoft.com/en-us/library/jj193448.aspx) - Express setup 
2. F�lg stegene p� [Install and configure workflow for SharePoint Server 2013](https://technet.microsoft.com/en-us/library/jj658588.aspx)
3. [Sett opp ditt milj� for Apps](https://technet.microsoft.com/en-us/library/fp161236.aspx)
4. Deployment-brukeren m� v�re site collection administrator.
5. Sett brukeren du skal provisjonere ut l�sningen med som administrator for termlageret. 




