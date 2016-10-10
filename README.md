# KomInn - Forslagsløsning for kommunale tiltak

## Kort funksjonell beskrivelse
KomInn er en løsning for SharePoint 2013 og SharePoint Online, bygget initielt for Asker kommune. Løsningen muliggjør innsendelse og behandling av innkommende forslag. 

## Teknisk beskrivelse
Løsningen er konstruert som en Single Page Application (SPA) med React. Løsningen er utviklet med hensyn til SharePoint Framework webparts, som kommer i en nær fremtid. Det er derfor valgt å bygge løsningen på React med TypeScript. 

Løsningen er initielt konstruert for SharePoint, men er designet for å kunne kobles på ethvert annet dataadapter.   


## Installasjon
Løsningen kan rulles ut både til SharePoint Online og SharePoint On-premise (2013 testet). Følg installasjonsveiledningen under.  

### Installasjon på SharePoint
1. Installer [Workflow Manager](https://msdn.microsoft.com/en-us/library/jj193448.aspx) - Express setup **(kun on-premise)** 
2. Følg stegene på [Install and configure workflow for SharePoint Server 2013](https://technet.microsoft.com/en-us/library/jj658588.aspx)  **(kun on-premise)**
4. Opprett en vanlig teamsite site collection. 
3. Deployment-brukeren må være site collection administrator.
5. Sett brukeren du skal provisjonere ut løsningen med som administrator for termlageret. 
6. Eksekver KomInn.Installer-programmet og velg fra menyen.

 



