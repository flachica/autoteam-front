'use client';

import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RulesClubs: React.FC = () => {
  
    const normas = [
        'A cada miembro del grupo se le asignará un saldo que será recargado por el importe de 20 euros. (Importe mensual equivalente a 2 pistas a la semana). Este importe no tiene fecha de caducidad y podrá ser devuelto si no se usa en el periodo de un mes',
        'Las pistas se colgarán el domingo, los administradores tendremos prioridad y ocuparemos los primeros puestos. Siempre será posible abrir segunda pista si se llenan los huecos. Cuantos más seamos, más jugaremos',
        'La pista se reservará cuando se completen los 4 huecos. Estos, solo podrán ser ocupados por jugadores con saldo positivo después de la reserva. En caso de quedar en negativo se pedirá la recarga de saldo por importe de 20 euros',
        'Se puede dar cuando alguien ocupa su hueco y trae un invitado que no forma parte del grupo. También se puede dar cuando alguien no pueda hacer la recarga de saldo pero otro compañero dispone y se lo presta. Nos reservamos el derecho de cortar este método según vayamos funcionando. Esto implica más gestión y no somos capaces de evaluar el esfuerzo necesario a priori',
        'Salvo restricción por disponibilidad, Las pistas serán Lunes, Miércoles y Viernes en San José. Martes y Jueves en La Rinconada.',
        'El ayuntamiento devuelve la pista con 30 minutos de antelación del partido y a criterio del personal de la instalación. Por ello, en cada partido cerrado debe haber alguien que se encargue de pedir la devolución de la pista. Una vez hecha se comunicará por el grupo de whatsapp para corregir vuestros saldos',
      ];
    
    return (
      <section className="section-content flex items-center justify-center bg-gray-100">
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Normas Básicas de uso
            </Typography>
            <List>
            {normas.map((norma, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon style={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText primary={norma} />
              </ListItem>
            ))}
            </List>
          </CardContent>
            </Card>
      </section>
      );
};

export default RulesClubs;