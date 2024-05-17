%--------------------------------------------------------------------------
%                                aRec_en.m                                   
%--------------------------------------------------------------------------
%  Rectangular dielectric resonator analysis (english)                                              
%
%    A) INPUTS
%
%    1. 'w' = Width of the resonator (cm)
%    2. 'd' = Depth of the resonator (cm)
%    3. 'h' = Height of the resonator (cm)
%    4. 'er' = Dielectric constant of the resonator
%    5. 'VSWR' = Tolerable voltage standing wave ratio for the calculation
%       of the impedance bandwidth
%
%    B) OUTPUTS
%
%    - The resonant frequency, Q-factor, and impedance bandwidth of the 
%      TE(x)d11, TE(y)1d1, and TE(z)11d modes. The TE(z)11d mode is for 
%      an isolated resonator (without a ground plane).
%--------------------------------------------------------------------------
%  Reference :
%
%  - R.K. Mongia and A. Ittipiboon, "Theoretical and experimental
%    investigations on rectangular dielectric resonator antennas," IEEE
%    Transactions on antennas and propagation, Vol. 45, No. 9, September
%    1997, pp. 1348-1356.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function aRec_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n--------------- Rectangular resonator analysis ----------------'));

% Input of the parameters:
w = [];
while isempty(w)||(isnumeric(w) == 0),
    w = input('\nInput the width (w) of the resonator (cm): ');
end

d = [];
while isempty(d)||(isnumeric(d) == 0),
    d = input('\nInput the depth (d) of the resonator (cm): ');
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
        

%====================================%
% Calculations for the TE(x)d11 mode %
%====================================%

% Resonant frequency (GHz):
syms x
ky = pi/w;
kz = pi/2/h;
k0 = sqrt((x^2+ky^2+kz^2)/er);
f = vectorize(real(x*tan(x*d/2)-sqrt((er-1)*k0^2-x^2)));
kx = fzero(inline(f),[0 pi/d-0.001]);
freq_TEx = 299792458/2/pi*sqrt((kx^2+ky^2+kz^2)/er)/1e7;
% Q-factor:
We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
pm = -i*2*pi*freq_TEx*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
k0 = sqrt((kx^2+ky^2+kz^2)/er);
Prad = 10*k0^4*norm(pm)^2;
Qfactor_TEx = 4*pi*freq_TEx*1e7*We/Prad; 
% Bandwidth:
BW_TEx = (VSWR-1)/(sqrt(VSWR)*Qfactor_TEx)*100;

%====================================%
% Calculations for the TE(y)1d1 mode %
%====================================%

% Resonant frequency (GHz):
syms y
kx = pi/d; 
kz = pi/2/h;
k0 = sqrt((kx^2+y^2+kz^2)/er);
f = vectorize(real(y*tan(y*w/2)-sqrt((er-1)*k0^2-y^2)));
ky = fzero(inline(f),[0 pi/w-0.001]);
freq_TEy = 299792458/2/pi*sqrt((kx^2+ky^2+kz^2)/er)/1e7;
% Q-factor:
We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
pm = -i*2*pi*freq_TEy*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
k0 = sqrt((kx^2+ky^2+kz^2)/er);
Prad = 10*k0^4*norm(pm)^2;
Qfactor_TEy = 4*pi*freq_TEy*1e7*We/Prad; 
% Bandwidth:
BW_TEy = (VSWR-1)/(sqrt(VSWR)*Qfactor_TEy)*100;

%====================================%
% Calculations for the TE(z)11d mode %
%====================================%

% Resonant frequency (GHz):
syms z
kx = pi/d;
ky = pi/w;
k0 = sqrt((kx^2+ky^2+z^2)/er);
f = vectorize(z*tan(z*h)-sqrt((er-1)*k0^2-z^2));
kz = fzero(inline(f),[0 pi/2/h-0.001]);
freq_TEz = 299792458/2/pi*sqrt((kx^2+ky^2+kz^2)/er)/1e7;
% Q-factor:
We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
pm = -i*2*pi*freq_TEz*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
k0 = sqrt((kx^2+ky^2+kz^2)/er);
Prad = 10*k0^4*norm(pm)^2;
Qfactor_TEz = 4*pi*freq_TEz*1e7*We/Prad; 
% Bandwidth:
BW_TEz = (VSWR-1)/(sqrt(VSWR)*Qfactor_TEz)*100;

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n--------------- Rectangular resonator analysis ----------------\n'));

% Display the input parameters:
disp(sprintf('Width (w) of the resonator (cm) = %5.4f',w));
disp(sprintf('Depth (d) of the resonator (cm) = %5.4f',d));
disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
disp(sprintf('Dielectric constant of the resonator = %5.4f',er));

% Display the results:
disp(sprintf('\n'));
disp(strvcat('                  TE(x)d11 mode                  ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TEx));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TEx));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TEx));

disp(sprintf('\n'));
disp(strvcat('                  TE(y)1d1 mode                  ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TEy));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TEy));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TEy));

disp(sprintf('\n'));
disp(strvcat('        TE(z)11d mode (isolated resonator)       ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TEz));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TEz));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TEz));

end