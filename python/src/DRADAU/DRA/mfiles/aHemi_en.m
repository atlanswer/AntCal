%--------------------------------------------------------------------------
%                                aHemi_en.m                                   
%--------------------------------------------------------------------------
%  Hemispherical dielectric resonator analysis (english)                                              
%
%    A) INPUTS
%    
%    1. 'a' = Radius of the resonator (cm)
%    2. 'er' = Dielectric constant of the resonator
%    3. 'VSWR' = Tolerable voltage standing wave ratio for the calculation
%       of the impedance bandwidth
%
%    B) OUTPUTS
%    
%    - The resonant frequency, Q-factor, and impedance bandwidth of the 
%      TE111 and TM101 modes.
%--------------------------------------------------------------------------
%  Reference:
%
%  - M. Gastine, L. Courtois, and J.J. Dormann, "Electromagnetic resonances
%    of free dielectric spheres," IEEE Transactions on microwave theory
%    and techniques, Vol. 15, No. 12, December 1967, pp. 694-700.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). The equations are from the book 
%        "Dielectric resonator antenna handbook" by Also Petosa.
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function aHemi_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n-------------- Hemispherical resonator analysis ---------------'));

% Input of the parameters:
a = [];
while isempty(a)||(isnumeric(a) == 0),
   a = input('\nInput the radius (a) of the resonator (cm): ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0),
   er = input('\nInput the dielectric constant (er) of the resonator: ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0),
   VSWR = input('\nInput the VSWR for the impedance bandwidth calculation (e.g.: 2): ');
end

%=================================%
% Calculations for the TE111 mode %
%=================================%

% Resonant frequency (GHz):
freq_TE = 2.8316*er^-0.47829*4.7713/a;
% Q-factor:
Qfactor_TE = 0.08+0.796*er+0.01226*er^2-3e-5*er^3;
% Bandwidth:
BW_TE = (VSWR-1)/(sqrt(VSWR)*Qfactor_TE)*100;

%=================================%
% Calculations for the TM101 mode %
%=================================%

% Resonant frequency (GHz):
freq_TM = 4.47226*er^-0.505*4.7713/a;
% Q-factor:
if (er <= 20)
    Qfactor_TM = 0.723+0.9324*er-0.0956*er^2+0.00403*er^3-5e-5*er^4;
else
    Qfactor_TM = 2.621-0.574*er+0.02812*er^2+2.59e-4*er^3;
end
% Bandwidth:
BW_TM = (VSWR-1)/(sqrt(VSWR)*Qfactor_TM)*100;

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n-------------- Hemispherical resonator analysis ---------------\n'));

% Display the input parameters:
disp(sprintf('Radius (a) of the resonator (cm) = %5.4f',a));
disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
disp(sprintf('VSWR for the impedance bandwidth calculation = %5.4f',VSWR));

% Display the results:
disp(sprintf('\n'));
disp(strvcat('                   TE111 mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TE));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TE));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   TM101 mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TM));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TM));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TM));

end