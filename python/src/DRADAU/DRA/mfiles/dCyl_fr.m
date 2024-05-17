%--------------------------------------------------------------------------
%                                dCyl_fr.m                                   
%--------------------------------------------------------------------------
%  Conception d'un résonateur cylindrique (français)                                              
%
%    A) ENTRÉES
%
%    1. 'freq' = fréquence de résonance visée                        
%    2. 'choix_mode' = mode de rayonnement choisi             
%    3. 'BW' = bande passante fractionnelle minimale désirée         
%    4. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul    
%    5. 'er' = constante diélectrique relative du matériau disponible
%    6. 'ratio' = ratio 'rayon/hauteur' du résonateur (facultatif)
%
%    B) SORTIES
%
%    - Les dimensions (rayon et hauteur) du résonateur qui respectent la 
%      bande passante minimale fixée pour la fréquence de résonance choisie
%      (si un ratio 'rayon/hauteur' n'est pas fourni par l'utilisateur,
%      une liste des dimensions respectant ces critères est générée pour
%      une plage de ratios définie).
%--------------------------------------------------------------------------
%  Références :
%
%  - R.K. Mongia et P. Barthia, "Dielectric resonator antennas - A review
%    and general design relations for resonant frequency and bandwidth",
%    International journal of microwave and millimeter-wave computer-
%    aided engineering, Vol. 4, Num. 3, 1994, pp. 230-247.
%  - A.A. Kishk, A.W. Glisson et G.P. Junker, "Study of broadband
%    dielectric resonator antennas", 1999 Antenna applications symposium,
%    septembre 1999, Allerton Park, Monticello (Il), pp. 45-68. 
%--------------------------------------------------------------------------
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m).
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function dCyl_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n----------- Conception d''un résonateur cylindrique ------------'));

% Entrée des paramètres :
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nEntrez la fréquence de résonance désirée (en GHz) : ');
end

choix_mode = [];
while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3 && choix_mode ~= 4)
    choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                        '   (1) Mode TE01d\n', ...
                        '   (2) Mode HE11d\n', ...
                        '   (3) Mode EH11d\n', ...
                        '   (4) Mode TM01d\n', ...
                        'Faites votre choix : ']);
end

BW = [];
while isempty(BW)||(isnumeric(BW) == 0)
   BW = input('\nEntrez la bande passante fractionelle minimale (ex.: 0.05 pour 5%) : ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nEntrez le VSWR pour le calcul de la bande passante (ex.: 2) : ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0)
    er = input('\nEntrez la constante diélectrique du matériau disponible : ');
end

ratio = [];
while isempty(ratio)||(isnumeric(ratio) == 0)
    ratio = input('\nEntrez le ratio ''rayon/hauteur'' (a/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
end

repeter = 1;
definir_plage_ratios = 1;
while (repeter == 1)
    
    % Détermination du facteur-Q maximal à partir du VSWR et de la bande passante spécifiée :
    facteurQ_max = (VSWR-1)/(sqrt(VSWR)*BW);
    facteurQ = [];

    % Si le ratio est spécifié par l'utilisateur, il faut vérifier s'il est possible d'obtenir la bande
    % passante désirée pour le mode de rayonnement choisi :
    if (ratio ~= 0)
        switch choix_mode 
            case 1
                facteurQ = 0.078192*er^1.27*(1+17.31*(1/ratio)-21.57*(1/ratio)^2+10.86*(1/ratio)^3-1.98*(1/ratio)^4);
            case 2
                facteurQ = 0.01007*er^1.3*(ratio)*(1+100*exp(-2.05*(0.5*ratio-1/80*(ratio)^2)));
            case 3
                facteurQ = er^2*(0.068-0.0388*ratio/2+0.0064*(ratio/2)^2+0.0007*exp(ratio/2*(37.59-63.8*ratio/2)));
            case 4
                facteurQ = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*ratio)*((38-er)/28))*...
                          (9.498186*ratio+2058.33*(ratio)^4.322261*exp(-3.50099*(ratio)));
        end
    
        % Si ce n'est pas possible, il faut que l'utilisateur change certaines spécifications :
        if (facteurQ_max < facteurQ)
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante désirée ne peut être atteinte pour ce mode avec la\n',...
                               'combinaison ratio/constante diélectrique choisie. Désirez-vous :\n', ...
                               '   (1) Modifier le ratio (ou ne pas en spécifier)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...                               
                               'Faites votre choix : ']);
            end   
        
            switch choix 
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nEntrez le nouveau ratio ''rayon/hauteur'' (a/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio == 0)
                        definir_plage_ratios = 1;
                    end
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 4 
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3 && choix_mode ~= 4)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode HE11d\n', ...
                                            '   (3) Mode EH11d\n', ...
                                            '   (4) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5     
                    return
            end    
        
        % Lorsque tous les parametres sont corrects, on calcule les dimensions du résonateur :
        else
            switch choix_mode
                case 1
                    h = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(ratio)-0.00898*(ratio)^2))/(freq*ratio);
                case 2
                    h = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*0.5*ratio+0.02*(0.5*ratio)^2))/(freq*ratio);
                case 3
                    h = 4.7713*((3.72+0.4464*ratio/2+0.2232*(ratio/2)^2+0.0521*(ratio/2)^3-2.65*...
                        exp(-1.25*ratio/2*(1+4.7*ratio/2)))/sqrt(er))/(freq*ratio);
                case 4
                    h = 4.7713*(sqrt(3.83^2+((pi/2)*ratio)^2)/sqrt(er+2))/(freq*ratio);
            end
            a = ratio*h;
            BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
            repeter = 0;    
        end
             
    else
        if(definir_plage_ratios == 1)
        
            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min == 0)
                ratio_min = input('\nEntrez le ratio minimal à étudier (un ratio >= 0.5 est recommandé) : ');
            end
        
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nEntrez le ratio maximal à étudier (un ratio <= 5 est recommandé) : ');
            end
        
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratios = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio_max - ratio_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end    
        
        for n = ratio_min:pas:ratio_max
            
            % Pour chaque valeur de n (de ratio), on évalue le facteur-Q
            switch choix_mode
                case 1
                    facteurQ = 0.078192*er^1.27*(1+17.31*(1/n)-21.57*(1/n)^2+10.86*(1/n)^3-1.98*(1/n)^4);
                case 2
                    facteurQ = 0.01007*er^1.3*(n)*(1+100*exp(-2.05*(0.5*n-1/80*(n)^2)));
                case 3
                    facteurQ = er^2*(0.068-0.0388*n/2+0.0064*(n/2)^2+0.0007*exp(n/2*(37.59-63.8*n/2)));
                case 4
                    facteurQ = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*n)*((38-er)/28))*...
                              (9.498186*n+2058.33*(n)^4.322261*exp(-3.50099*(n)));
            end
            
            % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, on calcule les 
            % dimensions du résonateur, sa bande passante réelle et on garde les résultats
            if (facteurQ_max > facteurQ)
                switch choix_mode
                    case 1
                        h = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(n)-0.00898*(n)^2))/(freq*n);
                    case 2 
                        h = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*0.5*n+0.02*(0.5*n)^2))/(freq*n);
                    case 3
                        h = 4.7713*((3.72+0.4464*n/2+0.2232*(n/2)^2+0.0521*(n/2)^3-2.65*...
                            exp(-1.25*n/2*(1+4.7*n/2)))/sqrt(er))/(freq*n);
                    case 4
                        h = 4.7713*(sqrt(3.83^2+((pi/2)*n)^2)/sqrt(er+2))/(freq*n);
                end
                a = n*h;
                BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                resultats(ligne,:) = [n a h facteurQ BW_reelle]; 
                ligne = ligne+1;
            end    
        end
        
        if(ligne == 1)
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nEntrez le nouveau ratio ''rayon/hauteur'' (a/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio == 0)
                        definir_plage_ratios = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 4
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3 && choix_mode ~= 4)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode HE11d\n', ...
                                            '   (3) Mode EH11d\n', ...
                                            '   (4) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5    
                    return
            end
            
        else
            repeter = 0;
        end    
    end
    
    if (repeter == 0)
        
        % Entête :
        clc
        disp(strvcat('===============================================================',...
                     ' Outil de conception et d''analyse des résonateur diélectriques',...
                     '==============================================================='));
        disp(sprintf('\n----------- Conception d''un résonateur cylindrique ------------\n'));
        
        % Affichage des paramètres d'entrée :
        disp(sprintf('Fréquence de résonance (en GHz) = %5.4f',freq));
    
        switch choix_mode
            case 1
                disp(sprintf('Mode de rayonnement = TE01d'));
            case 2
                disp(sprintf('Mode de rayonnement = HE11d'));
            case 3
                disp(sprintf('Mode de rayonnement = EH11d'));
            case 4
                disp(sprintf('Mode de rayonnement = TM01d'));
        end
    
        disp(sprintf('Bande passante fractionnelle minimale = %5.4f',BW));
        disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));
        disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
    
        if (ratio ~= 0)
            disp(sprintf('Ratio ''rayon/hauteur'' (a/h) = %5.4f',ratio));
            
            % Affichage des résultats (lorsqu'un ratio est spécifié)
            disp(sprintf('\n'));
            disp(strvcat('       Résultats pour le mode choisi        ', ...
                         '--------------------------------------------'));
            disp(sprintf('Rayon (a) du résonateur (en cm) = %5.4f',a));
            disp(sprintf('Hauteur (h) du résonateur (en cm) = %5.4f',h));
            disp(sprintf('Facteur-Q = %5.4f',facteurQ));
            disp(sprintf('Bande passante (en pourcentage) = %5.4f',BW_reelle));
            
        else
            disp(sprintf('Ratio ''rayon/hauteur'' (a/h) minimal = %5.4f',ratio_min));
            disp(sprintf('Ratio ''rayon/hauteur'' (a/h) maximal = %5.4f',ratio_max));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            
            % Affichage des résultats :
            disp(sprintf('\n'));
            disp(strvcat('             Résultats pour le mode choisi              ', ...  
                         '--------------------------------------------------------'));
            disp('a/h         a           h           facteurQ    BW');
            disp('--------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end         
        end
    end
end

end