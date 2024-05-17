%--------------------------------------------------------------------------
%                                aCyl_en.m                                   
%--------------------------------------------------------------------------
%  Cylindrical dielectric resonator analysis (english)                                              
%
%    A) INPUTS
%
%    1. 'a' = Radius of the resonator (cm)                            
%    2. 'h' = Height of the resonator (cm)                          
%    3. 'er' = Dielectric constant of the resonator         
%    4. 'VSWR' = Tolerable voltage standing wave ratio for the calculation
%       of the impedance bandwidth
%
%    B) OUTPUTS
%
%    - The resonant frequency, Q-factor, and impedance bandwidth of the     
%      TE01d, HE11d, EH11d, and TM01d modes.
%--------------------------------------------------------------------------
%  References:
%
%  - R.K. Mongia and P. Barthia, "Dielectric resonator antennas - A review
%    and general design relations for resonant frequency and bandwidth,"
%    International journal of microwave and millimeter-wave computer-
%    aided engineering, Vol. 4, No. 3, 1994, pp. 230-247.
%  - A.A. Kishk, A.W. Glisson, and G.P. Junker, "Study of broadband
%    dielectric resonator antennas," 1999 Antenna applications symposium,
%    September 1999, Allerton Park, Monticello, Il, pp. 45-68. 
%--------------------------------------------------------------------------  
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function aCyl_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n-------------- Cylindrical resonator analysis -----------------'));

% Input of the parameters:
a = [];
while isempty(a)||(isnumeric(a) == 0),
   a = input('\nInput the radius (a) of the resonator (cm): ');
end

h = [];
while isempty(h)||(isnumeric(h) == 0),
   h = input('\nInput the height (h) of the resonator (cm): ');
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
% Calculations for the TE01d mode %
%=================================%

% Resonant frequency (GHz):
freq_TE = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(a/h)-0.00898*(a/h)^2))/a;
% Q-factor:
Qfactor_TE = 0.078192*er^1.27*(1+17.31*(h/a)-21.57*(h/a)^2+10.86*(h/a)^3-1.98*(h/a)^4);
% Bandwidth:
BW_TE = (VSWR-1)/(sqrt(VSWR)*Qfactor_TE)*100;

%=================================%
% Calculations for the HE11d mode %
%=================================%

% Resonant frequency (GHz):
freq_HE = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*a/(2*h)+0.02*(a/(2*h))^2))/a;
% Q-factor:
Qfactor_HE = 0.01007*er^1.3*(a/h)*(1+100*exp(-2.05*(a/(2*h)-1/80*(a/h)^2)));
% Bandwidth:
BW_HE = (VSWR-1)/(sqrt(VSWR)*Qfactor_HE)*100;

%=================================%
% Calculations for the EH11d mode %
%=================================%

% Resonant frequency (GHz):
freq_EH = 4.7713*((3.72+0.4464*a/2/h+0.2232*(a/2/h)^2+0.0521*(a/2/h)^3-2.65*...
          exp(-1.25*a/2/h*(1+4.7*a/2/h)))/sqrt(er))/a;
% Q-factor:
Qfactor_EH = er^2*(0.068-0.0388*a/2/h+0.0064*(a/2/h)^2+0.0007*exp(a/2/h*(37.59-63.8*a/2/h)));
% Bandwidth:
BW_EH11 = (VSWR-1)/(sqrt(VSWR)*Qfactor_EH)*100;

%=================================%
% Calculations for the TM01d mode %
%=================================%

% Resonant frequency (GHz):
freq_TM = 4.7713*(sqrt(3.83^2+((pi*a)/(2*h))^2)/sqrt(er+2))/a;
% Q-factor:
Qfactor_TM = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*a/h)*((38-er)/28))*...
             (9.498186*a/h+2058.33*(a/h)^4.322261*exp(-3.50099*(a/h)));
% Bandwidth:
BW_TM = (VSWR-1)/(sqrt(VSWR)*Qfactor_TM)*100;

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n-------------- Cylindrical resonator analysis -----------------\n'));

% Display the input parameters:
disp(sprintf('Radius (a) of the resonator (cm) = %5.4f',a));
disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
disp(sprintf('VSWR for the impedance bandwidth calculation = %5.4f',VSWR));

% Display the results:
disp(sprintf('\n'));
disp(strvcat('                   TE01d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TE));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TE));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   HE11d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_HE));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_HE));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_HE));

disp(sprintf('\n'));
disp(strvcat('                   EH11d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_EH));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_EH));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_EH11));

disp(sprintf('\n'));
disp(strvcat('                   TM01d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TM));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TM));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TM));

end