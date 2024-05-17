%--------------------------------------------------------------------------
%                           DRA.m (version 1.2)                                   
%--------------------------------------------------------------------------
%  This Matlab application can be used to rapidly analyze and/or design 
%  dielectric resonators of various shapes (hemispherical, cylindrical, 
%  ring, and rectangular). The software assumes an infinite ground plane
%  and does not take into account the loading effect of the feeding 
%  structure. It is mainly intended as a tool for the development of 
%  dielectric resonator antennas (DRA).
%--------------------------------------------------------------------------
%  Cette application Matlab permet d'analyser et/ou de concevoir rapidement 
%  des résonateurs diélectriques hémispériques, cylindriques, annulaires et 
%  rectangulaires dépourvus de structure d'alimentation qui sont placés sur 
%  un plan de masse infini. Cet outil est destiné principalement au 
%  développement d'antennes diélectriques.
%--------------------------------------------------------------------------
%  Main references / Principales références :
%
%  - K.M. Luk et K.W. Leung, Dielectric resonator antennas, Baldock, 
%    Hertfordshire, Angleterre: Research Studies Press Ltd, 2003. 
%  - A. Petosa, Dielectric resonator antenna handbook, Norwood, MA: Artech
%    House, 2007.  
%--------------------------------------------------------------------------
%  Description of other M-files included in this package (detailed
%  descriptions are available at the beginning of each file):
%
%  Description des autres fichier .m inclus avec cette application (des
%  description détaillées sont disponibles au début de chaque fichier) :
%
%  English version / version anglaise :
%
%  aHemi_en.m = Hemispherical resonator analysis
%  dHemi_en.m = Hemispherical resonator design
%  aCyl_en.m = Cylindrical resonator analysis
%  dCyl_en.m = Cylindrical resonator design
%  aRing_en.m = Ring resonator analysis
%  dRing_en.m = Ring resonator design
%  aRec_en.m = Rectangular resonator analysis 
%  dRec_en.m = Rectangular resonator design
%
%  French version / version française :
%
%  aHemi_fr.m = Analyse des résonateurs hémisphériques 
%  dHemi_fr.m = Conception des résonateurs hémisphériques
%  aCyl_fr.m = Analyse des résonateurs cylindriques
%  dCyl_fr.m = Conception des résonateurs cylindriques
%  aRing_fr.m = Analyse des résonateurs annulaires
%  dRing_fr.m = Conception des résonateurs annulaires
%  aRec_fr.m = Analyse des résonateurs rectangulaires
%  dRec_fr.m = Conception des résonateurs rectangulaires
%
%  Files used for both languages / Fichiers communs aux deux langues :
%
%  calcX0.m, coeffTE.m, coeffQTE, coeffQTM = Sub-functions used for 
%  the design and analysis of ring resonators / Sous-fonctions utilisées
%  pour l'analyse et la conception des résonateurs annulaires.
%--------------------------------------------------------------------------
%  Note: the subfolder "images" contains drawings of every resonator 
%  configurations.
%
%  Note : le sous-répertoire "images" contient des dessins de toutes les 
%  configurations de résonateurs.
%--------------------------------------------------------------------------
%  Programming/Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Last modification/Dernière modification : 2008-07-31                              
%--------------------------------------------------------------------------
 
function DRA

clear all
close all
warning off all

% Set default display parameters / Préférences pour l'affichage : 
format short
set(0,'Units','pixels');
ecran = get(0,'ScreenSize');
posx = ecran(3)/2-161;
posy = ecran(4)/3;
set(0,'DefaultFigureWindowStyle','normal')
set(0,'DefaultFigureMenuBar','none');
set(0,'DefaultFigurePosition',[posx posy 322 152]);
set(0,'DefaultAxesVisible','off');
set(0,'DefaultAxesPosition',[0 0 1 1]);
set(0,'DefaultAxesActivePositionProperty','Position');

% Sub-folders to include / Dossiers secondaires à inclure :
addpath('mfiles');
addpath('images');

% Welcome message / Message de bienvenue :
clc
disp(strvcat('=================================================================', ...
             '                         Welcome to the                          ', ...
             '        Dielectric resonator design and analysis utility         ', ...
             '                          version 1.2                            ', ...
             '-----------------------------------------------------------------', ...
             '                         Bienvenue dans                          ', ...    
             ' l''Outil de conception et d''analyse des résonateur diélectriques ', ...
             '                          version 1.2                           ', ...
             '                                                                ', ...
             '        by / par : Alexandre Perron (perrona@emt.inrs.ca)       ', ...
             '      Institut national de la recherche scientifique (INRS)     ', ...
             '      Centre Énergie, matériaux et télécommunications (ÉMT)     ', ...
             '================================================================='));

% Language selection / Choix de la langue :
langue = [];
while isempty(langue)||(langue ~= 1 && langue ~= 2)
    langue = input(['\nPlease select language / S.V.P. choisir la langue :\n',...
                    '   (1) English\n',...
                    '   (2) Français\n',...
                    'Make your choice / Faites votre choix : ']);
end

while 1         
    if (langue == 1)         
        % Main menu (english) :
        clc
        choix=[];
        while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 ...
                               && choix ~= 5 && choix ~= 6 && choix ~= 7 && choix ~= 8 ...
                               && choix ~= 9)
        choix = input(['===============================================================\n',...
                       '       Dielectric resonator design and analysis utility        \n',...
                       '===============================================================\n',...
                       '\n------------------------- MAIN MENU ---------------------------\n',...
                       '\nDo you want to:\n',...
                       '\n',...
                       '   (1) Analyze a hemispherical resonator?\n',...
                       '   (2) Design a hemispherical resonator?\n',...
                       '\n',...
                       '   (3) Analyze a cylindrical resonator?\n',...
                       '   (4) Design a cylindrical resonator?\n',...
                       '\n',...
                       '   (5) Analyze a ring resonator?\n',...
                       '   (6) Design a ring resonator?\n',...
                       '\n',...
                       '   (7) Analyze a rectangular resonator?\n',...
                       '   (8) Design a rectangular resonator?\n',...
                       '\n',...
                       '   (9) Exit the application?\n',...
                       '\n',...
                       'Make your choice: ']);
        end
    else
        % Menu principal (français) :
        clc
        choix=[];
        while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 ...
                               && choix ~= 5 && choix ~= 6 && choix ~= 7 && choix ~= 8 ...
                               && choix ~= 9)
        choix = input(['===============================================================\n',...
                       ' Outil de conception et d''analyse des résonateur diélectriques\n',...
                       '===============================================================\n',...
                       '\n----------------------- MENU PRINCIPAL ------------------------\n',...
                       '\nDésirez-vous :\n',...
                       '\n',...
                       '   (1) Analyser un résonateur hémisphérique?\n',...
                       '   (2) Concevoir un résonateur hémisphérique?\n',...
                       '\n',...
                       '   (3) Analyser un résonateur cylindrique?\n',...
                       '   (4) Concevoir un résonateur cylindrique?\n',...
                       '\n',...
                       '   (5) Analyser un résonateur annulaire (cylindre troué)?\n',...
                       '   (6) Concevoir un résonateur annulaire (cylindre troué)?\n',...
                       '\n',...
                       '   (7) Analyser un résonateur rectangulaire?\n',...
                       '   (8) Concevoir un résonateur rectangulaire?\n',...
                       '\n',...
                       '   (9) Quitter le programme?\n',...
                       '\n',...
                       'Faites votre choix : ']);
        end
    end

    if (langue == 1)
        set(0,'DefaultFigureName','Resonator geometry');
        switch choix
            case 1
                image(imread('hemi_en.jpg'));
                aHemi_en
            case 2
                image(imread('hemi_en.jpg'));
                dHemi_en
            case 3
                image(imread('cyl_en.jpg'));
                aCyl_en
            case 4
                image(imread('cyl_en.jpg'));
                dCyl_en
            case 5
                image(imread('ann_en.jpg'));
                aRing_en
            case 6
                image(imread('ann_en.jpg'));
                dRing_en
            case 7 
                image(imread('rec_en.jpg'));
                aRec_en
            case 8   
                image(imread('rec_en.jpg'));
                dRec_en
            case 9
                rmpath('mfiles');
                rmpath('images');
                disp(sprintf('\nThank you for using this software!'));
                return
        end
        disp(sprintf('\n'));
        disp(sprintf('Press any key to return to the main menu...'));
        pause
        close all
    else
        set(0,'DefaultFigureName','Géométrie du résonateur');
        switch choix
            case 1
                image(imread('hemi_fr.jpg'));
                aHemi_fr
            case 2
                image(imread('hemi_fr.jpg'));
                dHemi_fr
            case 3
                image(imread('cyl_fr.jpg'));
                aCyl_fr
            case 4
                image(imread('cyl_fr.jpg'));
                dCyl_fr
            case 5
                image(imread('ann_fr.jpg'));
                aRing_fr
            case 6
                image(imread('ann_fr.jpg'));
                dRing_fr
            case 7 
                image(imread('rec_fr.jpg'));
                aRec_fr
            case 8   
                image(imread('rec_fr.jpg'));
                dRec_fr
            case 9
                rmpath('mfiles');
                rmpath('images');
                disp(sprintf('\nMerci d''avoir utilisé ce logiciel!'));
                return
        end
        disp(sprintf('\n'));
        disp(sprintf('Tapez sur une touche pour retourner au menu principal...'));
        pause
        close all
    end
end

end
